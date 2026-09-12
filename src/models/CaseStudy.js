import mongoose from 'mongoose';

const caseStudySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  summary: { type: String, required: true },
  problem: String,
  context: String,
  constraints: String,
  risks: String,
  approach: String,
  architecture: String,
  implementation: String,
  validation: String,
  result: String,
  lessons: String,
  technologies: [{ type: String }],
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export const CaseStudy = mongoose.model('CaseStudy', caseStudySchema);
