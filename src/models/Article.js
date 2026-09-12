import mongoose from 'mongoose';

const revisionSchema = new mongoose.Schema({
  title: String,
  excerpt: String,
  body: String,
  savedAt: { type: Date, default: Date.now },
}, { _id: false });

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  oldSlugs: [{ type: String, trim: true, lowercase: true }],
  subtitle: { type: String, trim: true },
  excerpt: { type: String, required: true, trim: true },
  body: { type: String, required: true },
  coverImage: { type: String, trim: true },
  tags: [{ type: String, trim: true }],
  series: { type: String, trim: true },
  status: { type: String, enum: ['draft', 'scheduled', 'published', 'archived'], default: 'draft', index: true },
  featured: { type: Boolean, default: false },
  publishedAt: Date,
  scheduledAt: Date,
  canonicalUrl: String,
  seoTitle: String,
  seoDescription: String,
  ogImage: String,
  linkedinHook: String,
  linkedinSummary: String,
  linkedinKeyPoints: [{ type: String }],
  linkedinCTA: String,
  linkedinHashtags: [{ type: String }],
  linkedinStatus: { type: String, enum: ['not_created', 'draft', 'ready', 'posted'], default: 'not_created' },
  linkedinPostedAt: Date,
  linkedinPostUrl: String,
  language: { type: String, enum: ['en', 'de', 'fa'], default: 'en' },
  germanSummary: String,
  internalNotes: String,
  relatedCaseStudies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CaseStudy' }],
  relatedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  relatedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  revisions: { type: [revisionSchema], default: [] },
}, { timestamps: true });

articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ title: 'text', excerpt: 'text', tags: 'text' });

export const Article = mongoose.model('Article', articleSchema);
