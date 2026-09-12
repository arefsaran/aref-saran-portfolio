import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  summary: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['active', 'maintained', 'experimental', 'planned', 'archived'], default: 'planned' },
  technologies: [{ type: String }],
  githubUrl: String,
  liveUrl: String,
  featured: { type: Boolean, default: false },
  coverImage: String,
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);
