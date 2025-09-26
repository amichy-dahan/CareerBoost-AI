const mongoose = require('mongoose');
const { Schema } = mongoose;

// Align with frontend statuses (see client/src/features/applications/types.js)
// We keep Title Case exactly so enum validation matches what the UI sends.
const STATUS_VALUES = [
  'Draft',
  'Applied',
  'HR Screen',
  'OA/Take-Home',
  'Tech Interview 1',
  'Tech Interview 2',
  'Final/Onsite',
  'Offer',
  'Rejected',
  'Ghosted',
  'Withdrawn'
];

const applicationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  company: { type: String, required: true, trim: true },
  roleTitle: { type: String, required: true, trim: true },
  location: { type: String, trim: true },
  source: { type: String, trim: true }, // e.g. LinkedIn, Company Site, Referral
  jobUrl: { type: String, trim: true },
  status: { type: String, enum: STATUS_VALUES, default: 'Draft', index: true },
  appliedAt: { type: Date },
  resumeId: { type: Schema.Types.ObjectId }, // placeholder for relation to a Resume collection (not defined yet)
  matchScore: { type: Number, min: 0, max: 100 }, // percentage match AI maybe calculates
  technologies: [{ type: String, trim: true }],
  tailoringNotes: { type: String },
  nextAction: { type: String },
  nextActionDate: { type: Date },
  offerComp: { type: String }, // Could be refined into nested object with base/bonus/equity
  rejectionReason: { type: String },
}, {
  timestamps: true // gives createdAt / updatedAt used by controller sorting
});

// Helpful compound index for user-specific recent updates queries
applicationSchema.index({ userId: 1, updatedAt: -1 });

// Basic text index (optional) to speed up search by company / roleTitle (controller currently uses regex OR)
// If you enable this, you could later switch to $text search.
applicationSchema.index({ company: 'text', roleTitle: 'text' });

applicationSchema.method('toJSON', function() {
  const obj = this.toObject({ virtuals: false });
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
});

module.exports = mongoose.model('Application', applicationSchema);
