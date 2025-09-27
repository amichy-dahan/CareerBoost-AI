/*
 Seed applications for user "or moscovitz" using provided dataset.

 Usage (PowerShell from server directory):
   node scripts/seedOrApplications.js

 Requirements:
   - MONGO_URI env var set.
   - User with firstName "or" (case-insensitive) and lastName "moscovitz" exists.

 This script:
   - Maps external statuses to internal enum.
   - Skips records whose (company, roleTitle) already exist for this user.
   - Parses AppliedDate -> appliedAt (Date object).
   - Logs inserted vs skipped counts.
*/
require('dotenv').config();
const mongoose = require('mongoose');
const Application = require('../models/Application');
const User = require('../models/User');

// Original dataset
const RAW_APPLICATIONS = [
  {"Company":"Tomax Think Academy","Role":"Junior Fullstack Engineer","AppliedDate":"2025-09-18","Status":"Saved","Technologies":["React","Node.js","TypeScript","SQL"]},
  {"Company":"BiltOn","Role":"Junior Full Stack Developer","AppliedDate":"2025-09-17","Status":"Applied","Technologies":["React Native","Node.js","AWS","Postgres"]},
  {"Company":"Elbit Systems","Role":"Full Stack Software Engineer (Junior)","AppliedDate":"2025-09-15","Status":"Phone screen","Technologies":["React","Java","Spring","Oracle"]},
  {"Company":"MateHR","Role":"Junior Full-stack (Python/React)","AppliedDate":"2025-09-20","Status":"Saved","Technologies":["Python","Django","React","Postgres"]},
  {"Company":"IronCircle","Role":"AI Fullstack Developer (Junior)","AppliedDate":"2025-09-14","Status":"Applied","Technologies":["Python","Flask","React","PyTorch"]},
  {"Company":"Sensi.AI","Role":"Junior Full Stack Developer","AppliedDate":"2025-09-12","Status":"Interviewing","Technologies":["Node.js","React","AWS","Docker"]},
  {"Company":"Reeco","Role":"Junior Full Stack Developer","AppliedDate":"2025-09-10","Status":"Saved","Technologies":["React","Node.js","MongoDB"]},
  {"Company":"Moon Active","Role":"Full Stack Developer - Junior","AppliedDate":"2025-09-11","Status":"Applied","Technologies":["React","Node.js","Kubernetes","Redis"]},
  {"Company":"Matific","Role":"Junior Full Stack Web Developer","AppliedDate":"2025-09-09","Status":"Phone screen","Technologies":["Vue.js","Node.js","Python","MySQL"]},
  {"Company":"Invaya","Role":"Junior Full Stack Developer","AppliedDate":"2025-09-08","Status":"Saved","Technologies":["Node.js","Angular","SQL"]},
  {"Company":"Code Oasis","Role":"Junior Full Stack Web Developer","AppliedDate":"2025-09-05","Status":"Rejected","Technologies":["Node.js","React","TypeScript"]},
  {"Company":"Overwolf","Role":"Junior Full-Stack Developer","AppliedDate":"2025-09-07","Status":"Applied","Technologies":["React","Electron","Node.js"]},
  {"Company":"NetApp","Role":"Junior Full Stack Developer","AppliedDate":"2025-09-04","Status":"Phone screen","Technologies":["React","Python","AWS"]},
  {"Company":"D-ID","Role":"Junior Full Stack Developer","AppliedDate":"2025-09-03","Status":"Saved","Technologies":["Node.js","React","GCP","Docker"]},
  {"Company":"Riskified","Role":"Junior Full-Stack Engineer","AppliedDate":"2025-09-02","Status":"Interviewing","Technologies":["Python","React","AWS","Postgres"]},
  {"Company":"888holdings","Role":"Junior Full Stack Developer","AppliedDate":"2025-09-01","Status":"Saved","Technologies":["JavaScript","Node.js","React","SQL"]},
  {"Company":"Au10tix","Role":"Junior Full Stack Developer","AppliedDate":"2025-09-06","Status":"Applied","Technologies":["Java","React","Docker","Kubernetes"]},
  {"Company":"Atera","Role":"Junior Full Stack Developer","AppliedDate":"2025-09-13","Status":"Phone screen","Technologies":["React","Node.js","Typescript"]},
  {"Company":"Earnix","Role":"Junior Full Stack Developer","AppliedDate":"2025-09-16","Status":"Saved","Technologies":["Python","React","SQL"]},
  {"Company":"PRIMIS","Role":"Junior Full Stack - Monetization","AppliedDate":"2025-09-19","Status":"Applied","Technologies":["JavaScript","Node.js","React"]},
  {"Company":"Comet ML","Role":"Junior Full Stack Developer","AppliedDate":"2025-09-21","Status":"Applied","Technologies":["Python","React","Docker"]},
  {"Company":"WeDev","Role":"Junior FullStack Web Developer","AppliedDate":"2025-09-14","Status":"Saved","Technologies":["PHP","Laravel","Vue.js","MySQL"]},
  {"Company":"Zorro (internship)","Role":"Junior Full-Stack Intern","AppliedDate":"2025-09-20","Status":"Interviewing","Technologies":["Node.js","React","AWS"]},
  {"Company":"Venn","Role":"Junior Full Stack Developer","AppliedDate":"2025-09-22","Status":"Applied","Technologies":["React","Node.js","TypeScript"]},
  {"Company":"Vianai Systems","Role":"Junior Full Stack Engineer","AppliedDate":"2025-09-23","Status":"Saved","Technologies":["Python","React","AWS"]},
  {"Company":"Allyable","Role":"Junior Full Stack Developer (Remote/ISR)","AppliedDate":"2025-09-18","Status":"Applied","Technologies":["Node.js","React","MongoDB"]},
  {"Company":"FundGuard","Role":"Junior Backend/Full Stack Developer","AppliedDate":"2025-09-12","Status":"Phone screen","Technologies":["Java","React","SQL"]},
  {"Company":"Tomax Think Academy (senior listing present too)","Role":"Junior Full Stack (academy)","AppliedDate":"2025-09-11","Status":"Saved","Technologies":["React","Node.js","TypeScript"]},
  {"Company":"FrontStory","Role":"Junior Full Stack Developer","AppliedDate":"2025-09-10","Status":"Applied","Technologies":["React","Node.js","SQL"]},
  {"Company":"Omnisys","Role":"Junior Full Stack Developer","AppliedDate":"2025-09-09","Status":"Rejected","Technologies":["Node.js","Angular","SQL"]},
  {"Company":"Zero Networks","Role":"Junior Full Stack (Frontend oriented)","AppliedDate":"2025-09-08","Status":"Phone screen","Technologies":["React","TypeScript","Node.js"]},
  {"Company":"PubPlus","Role":"Junior Full Stack Developer","AppliedDate":"2025-09-07","Status":"Saved","Technologies":["Node.js","React","Postgres"]},
  {"Company":"Horizon Technologies","Role":"Junior Full Stack Developer","AppliedDate":"2025-09-06","Status":"Applied","Technologies":["OutSystems","JavaScript"]},
  {"Company":"Atera (duplicate - different team)","Role":"Junior Full Stack - Support Team","AppliedDate":"2025-09-05","Status":"Interviewing","Technologies":["React","Node.js","Linux"]},
  {"Company":"Moon Active (another team)","Role":"Junior Game Full Stack Developer","AppliedDate":"2025-09-03","Status":"Saved","Technologies":["Node.js","React","Redis"]},
  {"Company":"Toonimo","Role":"Junior Frontend/Full Stack","AppliedDate":"2025-09-02","Status":"Applied","Technologies":["React","JavaScript","CSS"]},
  {"Company":"McCANN (tech team)","Role":"Junior Full Stack Developer - Monetization","AppliedDate":"2025-09-01","Status":"Saved","Technologies":["React","Node.js"]},
  {"Company":"Comet ML (another listing)","Role":"Junior Full Stack - Platform","AppliedDate":"2025-09-21","Status":"Applied","Technologies":["Python","React","Docker"]},
  {"Company":"Au10tix (another team)","Role":"Junior Full Stack Engineer","AppliedDate":"2025-09-20","Status":"Phone screen","Technologies":["C#",".NET","React"]}
];

// Map external statuses to internal enum (Draft, Applied, HR Screen, OA/Take-Home, Tech Interview 1, Tech Interview 2, Final/Onsite, Offer, Rejected, Ghosted, Withdrawn)
function mapStatus(external) {
  if (!external) return 'Draft';
  const s = external.toLowerCase();
  if (s === 'saved') return 'Draft';
  if (s === 'applied') return 'Applied';
  if (s === 'phone screen' || s === 'phone-screen' || s === 'phone') return 'HR Screen';
  if (s === 'interviewing' || s === 'interview') return 'Tech Interview 1';
  if (s === 'rejected') return 'Rejected';
  // fallback
  return 'Draft';
}

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.findOne({ 
    firstName: /or/i, 
    lastName: /moscovitz/i 
  });
  if (!user) {
    console.error('User "or moscovitz" not found. Create the user first.');
    process.exit(1);
  }
  console.log('Seeding applications for user:', user._id.toString());

  const existing = await Application.find({ userId: user._id }).select('company roleTitle');
  const existingSet = new Set(existing.map(e => `${e.company.toLowerCase()}__${e.roleTitle.toLowerCase()}`));

  const docs = [];
  for (const row of RAW_APPLICATIONS) {
    const key = `${row.Company.toLowerCase()}__${row.Role.toLowerCase()}`;
    if (existingSet.has(key)) {
      continue; // skip duplicate
    }
    const appliedAt = row.AppliedDate ? new Date(row.AppliedDate) : undefined;
    if (appliedAt && isNaN(appliedAt.getTime())) {
      console.warn('Invalid date skipped for', row.Company, row.AppliedDate);
    }
    docs.push({
      userId: user._id,
      company: row.Company,
      roleTitle: row.Role,
      appliedAt: appliedAt && !isNaN(appliedAt.getTime()) ? appliedAt : undefined,
      status: mapStatus(row.Status),
      technologies: row.Technologies || [],
      source: 'Seed',
      matchScore: undefined
    });
  }

  if (!docs.length) {
    console.log('No new applications to insert (all duplicates).');
    process.exit(0);
  }

  const inserted = await Application.insertMany(docs, { ordered: false });
  console.log(`Inserted ${inserted.length} applications (skipped ${RAW_APPLICATIONS.length - inserted.length})`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
