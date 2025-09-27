const express = require('express');
const router = express.Router();
const { authenticate } = require('../middellwares/authenticate');
const Application = require('../models/Application');

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const apps = await Application.find({ userId })
      .select('status company appliedAt matchScore nextAction nextActionDate technologies')
      .lean();

    const actions = [];
    const now = Date.now();

    for (const app of apps) {
      const baseId = app._id.toString();
      const nextTs = app.nextActionDate ? new Date(app.nextActionDate).getTime() : null;
      const appliedTs = app.appliedAt ? new Date(app.appliedAt).getTime() : null;

      if (['Tech Interview 1','Tech Interview 2','Final/Onsite'].includes(app.status) && nextTs) {
        actions.push({
          id: `${baseId}-interview-${app.status}`,
          title: 'Prepare for upcoming interview',
          description: `Interview at ${app.company} on ${new Date(nextTs).toLocaleDateString('en-US',{month:'short',day:'numeric'})}. Review system design + past projects`,
          priority: 'High',
          impact: '+15 pts',
          icon: 'AlertCircle',
          color: 'text-destructive'
        });
      }

      if (app.status === 'Applied' && appliedTs) {
        const days = Math.floor((now - appliedTs)/86400000);
        if (days >= 5 && days <= 10) {
          actions.push({
            id: `${baseId}-followup-${days}`,
            title: 'Follow up on recent application',
            description: `Applied to ${app.company} ${days} days ago. Send a concise follow-up email.`,
            priority: 'Medium',
            impact: '+8 pts',
            icon: 'Clock',
            color: 'text-primary'
          });
        }
      }

      if (app.matchScore && app.matchScore < 75) {
        actions.push({
          id: `${baseId}-lowmatch-${app.matchScore}`,
          title: 'Improve low match score',
          description: `${app.company} at ${app.matchScore}%. Refine résumé keywords.`,
          priority: 'Medium',
          impact: '+10 pts',
          icon: 'Clock',
          color: 'text-primary'
        });
      }

      if (!app.nextAction || !app.nextAction.trim()) {
        actions.push({
          id: `${baseId}-missing-next`,
          title: 'Add next action',
          description: `${app.company} has no defined next step. Add one.`,
          priority: 'Low',
          impact: '+3 pts',
          icon: 'CheckCircle',
          color: 'text-success'
        });
      }
    }

    const order = { High: 3, Medium: 2, Low: 1 };
    actions.sort((a,b) => order[b.priority]-order[a.priority]);
    return res.json({ actions: actions.slice(0,3) });
  } catch (e) {
    console.error('[PriorityActions] error', e);
    res.status(500).json({ error: 'Failed to compute priority actions' });
  }
});

module.exports = router;