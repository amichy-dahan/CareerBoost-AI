// Seed applications for an existing user by email (or create if absent with optional password).
// Usage:
//   node scripts/seedForEmail.js <email> [count]
// Example:
//   node scripts/seedForEmail.js user@example.com 40
// If user does not exist, it is created with firstName='Seed', lastName='User'.
// NOTE: Created user will have no password (cannot login via password flow) unless you adapt logic.

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Application = require('../models/Application');

(async () => {
  const [email, countArg] = process.argv.slice(2);
  if (!email) {
    console.error('Usage: node scripts/seedForEmail.js <email> [count]');
    process.exit(1);
  }
  const count = parseInt(countArg || '20', 10);
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI missing');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI, { maxPoolSize: 5 });
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, firstName: 'Seed', lastName: 'User', password: undefined });
      console.log(`[seedForEmail] Created user ${email} (_id=${user._id})`);
    } else {
      console.log(`[seedForEmail] Using existing user ${email} (_id=${user._id})`);
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
      const createdDaysAgo = Math.floor(Math.random() * 35);
      const appliedAt = ['Draft','Rejected','Ghosted','Withdrawn'].includes(status) ? undefined : new Date(Date.now() - createdDaysAgo * 86400000);
      const nextActionNeeded = ['Applied','HR Screen','OA/Take-Home','Tech Interview 1','Tech Interview 2','Final/Onsite'].includes(status) && Math.random() < 0.5;
      const nextActionDate = nextActionNeeded ? new Date(Date.now() + Math.floor(Math.random()*10 - 4) * 86400000) : undefined;

      docs.push({
        userId: user._id,
        company: `Company-${i+1}`,
        roleTitle: pick(['Frontend Engineer','Full Stack Developer','Backend Engineer','Data Engineer','DevOps Engineer']),
        location: pick(['Remote','NY, USA','SF, USA','Berlin, DE','Tel Aviv, IL']),
        source: pick(SOURCES),
        jobUrl: `https://example.com/jobs/${1000 + i}`,
        status,
        appliedAt,
        matchScore: Math.random() < 0.65 ? 50 + Math.floor(Math.random()*45) : undefined,
        technologies: pickSome(TECHNOLOGIES),
        tailoringNotes: Math.random() < 0.3 ? 'Tweaked resume for JD keywords.' : '',
        nextAction: nextActionNeeded ? pick(['Follow up','Prepare algo practice','Send thank you','Schedule next round']) : '',
        nextActionDate,
        offerComp: status === 'Offer' ? '$' + (110 + Math.floor(Math.random()*35)) + 'k + equity' : undefined,
        rejectionReason: status === 'Rejected' ? pick(['Insufficient experience depth','Position frozen','Internal candidate']) : undefined
      });
    }

    const result = await Application.insertMany(docs);
    console.log(`[seedForEmail] Inserted ${result.length} applications for ${email}`);
  } catch (err) {
    console.error('[seedForEmail] Error:', err.message);
    console.error(err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
