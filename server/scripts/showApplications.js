// Show (list) Application documents for a given user's email.
// Usage:
//   node scripts/showApplications.js [userEmail] [limit]
// Example:
//   node scripts/showApplications.js                # devuser@example.com, limit 10
//   node scripts/showApplications.js someone@x.com 25
//
// Add a 3rd argument to filter by company substring:
//   node scripts/showApplications.js devuser@example.com 20 amazon
//
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Application = require('../models/Application');

(async () => {
  const email = process.argv[2] && !/^[0-9]+$/.test(process.argv[2]) ? process.argv[2] : 'devuser@example.com';
  const limitArgIndex = email === 'devuser@example.com' && process.argv[2] && /^[0-9]+$/.test(process.argv[2]) ? 2 : 3;
  const limit = parseInt(process.argv[limitArgIndex] || '10', 10);
  const companyFilter = process.argv[limitArgIndex + 1];

  if (!process.env.MONGO_URI) {
    console.error('[show] MONGO_URI missing in environment');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, { maxPoolSize: 5 });

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`[show] No user found with email ${email}`);
      process.exit(1);
    }

    const query = { userId: user._id };
    if (companyFilter) {
      query.company = { $regex: companyFilter, $options: 'i' };
    }

    const total = await Application.countDocuments(query);
    const apps = await Application.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();

    console.log(`[show] User: ${email} (_id=${user._id})`);
    console.log(`[show] Total applications matching${companyFilter ? ' (filtered)' : ''}: ${total}`);
    if (!apps.length) {
      console.log('[show] No applications to display');
    } else {
      // Shape data for table display
      const table = apps.map(a => ({
        id: a._id.toString(),
        company: a.company,
        role: a.roleTitle,
        status: a.status,
        appliedAt: a.appliedAt ? new Date(a.appliedAt).toISOString().slice(0,10) : '',
        match: a.matchScore ?? '',
        tech: (a.technologies || []).slice(0,4).join(',') + ((a.technologies || []).length > 4 ? '…' : ''),
        nextAction: a.nextAction || '',
      }));
      console.table(table);
    }
  } catch (err) {
    console.error('[show] Error:', err.message);
    console.error(err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
