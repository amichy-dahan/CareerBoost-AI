const Application = require('../models/Application');

// Build a Mongo filter from query params and user id
function buildFilter(query, userId) {
  const { search, status, source, technologies } = query;
  const filter = { userId };
  if (search) {
    const rx = new RegExp(search, 'i');
    filter.$or = [{ company: rx }, { roleTitle: rx }];
  }
  if (status) {
    const arr = Array.isArray(status) ? status : status.split(',');
    filter.status = { $in: arr };
  }
  if (source) filter.source = source;
  if (technologies) {
    const arr = Array.isArray(technologies) ? technologies : technologies.split(',');
    filter.technologies = { $in: arr };
  }
  return filter;
}

async function list(req, res) {
  try {
    const userId = req.user.id;
    let { page = 1, pageSize = 20, search } = req.query;
    page = Math.max(parseInt(page, 10) || 1, 1);
    pageSize = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 200); // cap at 200

    // Base filter (other filters handled by existing buildFilter for status/source/technologies)
    const baseFilter = buildFilter(req.query, userId);
    delete baseFilter.$or; // we'll rebuild search below for better performance

    const match = { ...baseFilter };
    let useText = false;
    if (search) {
      const s = String(search).trim();
      if (s.length > 2) {
        // If text index exists on company/roleTitle, this will leverage it
        useText = true;
        match.$text = { $search: s };
      } else if (s.length) {
        // Short prefix anchored regex (can leverage single-field indexes if added)
        const rx = new RegExp('^' + escapeRegex(s), 'i');
        match.$or = [{ company: rx }, { roleTitle: rx }];
      }
    }

    const sortStage = useText
      ? { score: { $meta: 'textScore' }, updatedAt: -1 }
      : { updatedAt: -1 };

    const skip = (page - 1) * pageSize;

    const pipeline = [
      { $match: match },
      ...(useText ? [{ $addFields: { score: { $meta: 'textScore' } } }] : []),
      {
        $facet: {
          meta: [ { $count: 'total' } ],
          items: [
            { $sort: sortStage },
            { $skip: skip },
            { $limit: pageSize },
            { $project: {
                company: 1,
                roleTitle: 1,
                status: 1,
                appliedAt: 1,
                matchScore: 1,
                technologies: 1,
                nextAction: 1,
                nextActionDate: 1,
                jobUrl: 1,
                location: 1,
                updatedAt: 1,
                createdAt: 1
              }
            }
          ]
        }
      },
      { $project: { total: { $ifNull: [{ $first: '$meta.total' }, 0] }, items: 1 } }
    ];

    const [agg] = await Application.aggregate(pipeline).allowDiskUse(true);
    const total = agg?.total || 0;
    const items = (agg?.items || []).map(doc => ({ id: doc._id.toString(), ...doc }));
    res.json({ items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch (err) {
    console.error('List applications error', err);
    res.status(500).json({ error: 'Failed to list applications' });
  }
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function getOne(req, res) {
  try {
    const userId = req.user.id;
    const app = await Application.findOne({ _id: req.params.id, userId }).lean();
    if (!app) return res.status(404).json({ error: 'Not found' });
    res.json({ ...app, id: app._id.toString(), _id: undefined });
  } catch (err) {
    console.error('Get application error', err);
    res.status(500).json({ error: 'Failed to get application' });
  }
}

async function create(req, res) {
  try {
    const userId = req.user.id;
    const body = sanitizeBody(req.body);
    const app = await Application.create({ ...body, userId });
    res.status(201).json(app.toJSON());
  } catch (err) {
    console.error('Create application error', {
      message: err.message,
      name: err.name,
      code: err.code,
      stack: err.stack,
      body: req.body
    });
    // Differentiate validation vs other errors (also include CastError)
    const status = (err.name === 'ValidationError' || err.name === 'CastError') ? 422 : 400;
    res.status(status).json({ error: err.message || 'Failed to create application' });
  }
}

async function update(req, res) {
  try {
    const userId = req.user.id;
    const body = sanitizeBody(req.body, true);
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, userId },
      body,
      { new: true }
    );
    if (!app) return res.status(404).json({ error: 'Not found' });
    res.json(app.toJSON());
  } catch (err) {
    console.error('Update application error', {
      message: err.message,
      name: err.name,
      code: err.code,
      stack: err.stack,
      body: req.body,
      id: req.params.id
    });
    const status = (err.name === 'ValidationError' || err.name === 'CastError') ? 422 : 400;
    res.status(status).json({ error: err.message || 'Failed to update application' });
  }
}

async function remove(req, res) {
  try {
    const userId = req.user.id;
    const deleted = await Application.findOneAndDelete({ _id: req.params.id, userId });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete application error', err);
    res.status(500).json({ error: 'Failed to delete application' });
  }
}

// Ensure only allowed fields are persisted
function sanitizeBody(body, partial = false) {
  const allowed = [
    'company',
    'roleTitle',
    'location',
    'source',
    'jobUrl',
    'status',
    'appliedAt',
    'resumeId',
    'matchScore',
    'technologies',
    'tailoringNotes',
    'nextAction',
    'nextActionDate',
    'offerComp',
    'rejectionReason'
  ];
  const out = {};
  for (const key of allowed) {
    if (body[key] !== undefined) out[key] = body[key];
  }

  // Normalize empty strings to undefined for optional fields that are typed.
  ['appliedAt', 'nextActionDate', 'offerComp', 'rejectionReason', 'jobUrl', 'location', 'tailoringNotes', 'nextAction'].forEach(k => {
    if (out[k] === '') delete out[k];
  });

  // Dates: ensure valid or remove
  ['appliedAt', 'nextActionDate'].forEach(k => {
    if (out[k]) {
      const d = new Date(out[k]);
      if (isNaN(d.getTime())) delete out[k];
      else out[k] = d; // store as Date
    }
  });

  // Match score: ensure number within range
  if (out.matchScore !== undefined) {
    const n = Number(out.matchScore);
    if (Number.isNaN(n) || n < 0 || n > 100) {
      throw new Error('matchScore must be a number between 0 and 100');
    }
    out.matchScore = n;
  }

  // Technologies: ensure array of strings
  if (out.technologies !== undefined) {
    if (!Array.isArray(out.technologies)) {
      throw new Error('technologies must be an array');
    }
    out.technologies = out.technologies.map(t => String(t)).filter(Boolean);
  }

  // Resume: drop empty strings
  if (out.resumeId === '') delete out.resumeId;

  if (!partial) {
    if (!out.company) throw new Error('company is required');
    if (!out.roleTitle) throw new Error('roleTitle is required');
  }
  return out;
}

module.exports = { list, getOne, create, update, remove };
