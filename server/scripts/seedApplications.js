// Seed mock Application documents for local development.
// Usage:
//   node scripts/seedApplications.js [count] [userEmail]
// Examples:
//   node scripts/seedApplications.js          -> seeds 15 apps for (or creates) devuser@example.com
//   node scripts/seedApplications.js 40       -> seeds 40 apps for devuser@example.com
//   node scripts/seedApplications.js 25 someone@domain.com
// Requires: MONGO_URI in .env

require('dotenv').config();
const mongoose = require('mongoose');
const Application = require('../models/Application');
const User = require('../models/User');

(async () => {
  const count = parseInt(process.argv[2] || '15', 10);
  const userEmail = process.argv[3] || 'devuser@example.com';
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI missing in environment');
    process.exit(1);
  }

  console.log(`[seed] Connecting to Mongo (count=${count}, userEmail=${userEmail})...`);
  await mongoose.connect(uri, { maxPoolSize: 5 });

  try {
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      user = await User.create({
        email: userEmail,
        firstName: 'Dev',
        lastName: 'User',
        password: undefined
      });
      console.log(`[seed] Created new user _id=${user._id}`);
    } else {
      console.log(`[seed] Using existing user _id=${user._id}`);
    }

    const STATUSES = [
      'Draft','Applied','HR Screen','OA/Take-Home','Tech Interview 1','Tech Interview 2','Final/Onsite','Offer','Rejected','Ghosted','Withdrawn'
    ];
    const SOURCES = ['Referral','Company Site','LinkedIn','Indeed','Other'];
    const TECHNOLOGIES = ['React','TypeScript','Node.js','MongoDB','PostgreSQL','Docker','AWS','Express.js','Tailwind CSS','GraphQL'];

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function pickSome(arr) {
      const copy = [...arr];
      const n = 1 + Math.floor(Math.random() * Math.min(4, copy.length));
      const out = [];
      for (let i = 0; i < n; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        out.push(copy.splice(idx, 1)[0]);
      }
      return out.sort();
    }

    const docs = [];
    for (let i = 0; i < count; i++) {
      const status = pick(STATUSES);
      const createdDaysAgo = Math.floor(Math.random() * 45); // within ~ last 45 days
      const appliedAt = ['Draft','Rejected','Ghosted','Withdrawn'].includes(status) ? undefined : new Date(Date.now() - createdDaysAgo * 86400000);
      const nextActionNeeded = ['Applied','HR Screen','OA/Take-Home','Tech Interview 1','Tech Interview 2','Final/Onsite'].includes(status) && Math.random() < 0.5;
      const nextActionDate = nextActionNeeded ? new Date(Date.now() + Math.floor(Math.random()*10 - 3) * 86400000) : undefined; // could be past for overdue

      docs.push({
        userId: user._id,
        company: `Company ${String.fromCharCode(65 + (i % 26))}${i}`,
        roleTitle: pick(['Frontend Engineer','Full Stack Developer','Backend Engineer','DevOps Engineer','Data Engineer']),
        location: pick(['Remote','NY, USA','SF, USA','Berlin, DE','Tel Aviv, IL']),
        source: pick(SOURCES),
        jobUrl: `https://example.com/jobs/${1000 + i}`,
        status,
        appliedAt,
        resumeId: undefined, // placeholder - frontend uses mock values
        matchScore: Math.random() < 0.7 ? 60 + Math.floor(Math.random()*35) : undefined,
        technologies: pickSome(TECHNOLOGIES),
        tailoringNotes: Math.random() < 0.4 ? 'Customized resume for keywords.' : '',
        nextAction: nextActionNeeded ? pick(['Follow up email','Prepare system design','Complete OA','Send thank you note']) : '',
        nextActionDate,
        offerComp: status === 'Offer' ? '$' + (110 + Math.floor(Math.random()*40)) + 'k + equity' : undefined,
        rejectionReason: status === 'Rejected' ? pick(['Lacked specific framework experience','Position frozen','Went with internal candidate']) : undefined
      });
    }

    const result = await Application.insertMany(docs);
    console.log(`[seed] Inserted ${result.length} applications.`);

    // Quick summary by status
    const aggregation = await Application.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    console.log('[seed] Status distribution:');
    aggregation.forEach(r => console.log(`  ${r._id}: ${r.count}`));
  } catch (err) {
    console.error('[seed] Error:', err.message);
    console.error(err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('[seed] Done.');
  }
})();
