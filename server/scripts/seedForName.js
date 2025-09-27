// Seed applications for a user specified by first & last name.
// Usage:
//   node scripts/seedForName.js <FirstName> <LastName> [count]
// Example:
//   node scripts/seedForName.js Or Moscovitz 30
// Logic:
//   1. Finds existing user by exact firstName + lastName.
//   2. If not found, creates one with generated email: <first>.<last>.dev@example.com
//   3. Seeds <count> (default 15) applications (same generator as seedApplications.js)
// NOTE: If the real user has a different email, prefer using seedApplications.js with that email.

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Application = require('../models/Application');

async function main() {
  const [firstName, lastName, countArg] = process.argv.slice(2);
  if (!firstName || !lastName) {
    console.error('Usage: node scripts/seedForName.js <FirstName> <LastName> [count]');
    process.exit(1);
  }
  const count = parseInt(countArg || '15', 10);
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI missing in environment');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI, { maxPoolSize: 5 });
  try {
    let user = await User.findOne({ firstName, lastName });
    if (!user) {
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.dev@example.com`;
      const plainPassword = process.env.DEFAULT_SEEDED_PASSWORD || 'TempPass123!';
      const hashed = await bcrypt.hash(plainPassword, 10);
      user = await User.create({ firstName, lastName, email, password: hashed });
      console.log(`[seedForName] Created user ${firstName} ${lastName} with email ${email} (_id=${user._id})`);
      console.log(`[seedForName] INITIAL PASSWORD: ${plainPassword}`);
    } else {
      // If user exists but has no password (e.g. earlier seeding), set one so login works.
      if (!user.password) {
        const plainPassword = process.env.DEFAULT_SEEDED_PASSWORD || 'TempPass123!';
        user.password = await bcrypt.hash(plainPassword, 10);
        await user.save();
        console.log(`[seedForName] Added password to existing user. INITIAL PASSWORD: ${plainPassword}`);
      }
      console.log(`[seedForName] Using existing user ${firstName} ${lastName} (_id=${user._id}, email=${user.email})`);
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
      const createdDaysAgo = Math.floor(Math.random() * 30);
      const appliedAt = ['Draft','Rejected','Ghosted','Withdrawn'].includes(status) ? undefined : new Date(Date.now() - createdDaysAgo * 86400000);
      const nextActionNeeded = ['Applied','HR Screen','OA/Take-Home','Tech Interview 1','Tech Interview 2','Final/Onsite'].includes(status) && Math.random() < 0.5;
      const nextActionDate = nextActionNeeded ? new Date(Date.now() + Math.floor(Math.random()*10 - 3) * 86400000) : undefined;

      docs.push({
        userId: user._id,
        company: `Ormosc Company ${i+1}`,
        roleTitle: pick(['Frontend Engineer','Full Stack Developer','Backend Engineer','DevOps Engineer','Data Engineer']),
        location: pick(['Remote','NY, USA','SF, USA','Berlin, DE','Tel Aviv, IL']),
        source: pick(SOURCES),
        jobUrl: `https://example.com/jobs/ormosc-${1000 + i}`,
        status,
        appliedAt,
        matchScore: Math.random() < 0.6 ? 55 + Math.floor(Math.random()*40) : undefined,
        technologies: pickSome(TECHNOLOGIES),
        tailoringNotes: Math.random() < 0.35 ? 'Adjusted resume for keyword alignment.' : '',
        nextAction: nextActionNeeded ? pick(['Follow up','Prepare coding interview','Send thank you','Review system design']) : '',
        nextActionDate,
        offerComp: status === 'Offer' ? '$' + (115 + Math.floor(Math.random()*30)) + 'k + equity' : undefined,
        rejectionReason: status === 'Rejected' ? pick(['Insufficient depth in React','Position paused','Chose internal candidate']) : undefined
      });
    }

    const result = await Application.insertMany(docs);
    console.log(`[seedForName] Inserted ${result.length} applications for ${firstName} ${lastName}.`);

    const aggregation = await Application.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    console.log('[seedForName] Status distribution (all for this user):');
    aggregation.forEach(r => console.log(`  ${r._id}: ${r.count}`));

    console.log('\nNext: view them with:');
    console.log(`  node scripts/showApplications.js ${user.email} 20`);

  } catch (err) {
    console.error('[seedForName] Error:', err.message);
    console.error(err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
