import { Article } from '../models/Article.js';
import { CaseStudy } from '../models/CaseStudy.js';
import { Project } from '../models/Project.js';
import { Video } from '../models/Video.js';

export async function dashboardStats() {
  const [draft, scheduled, published, archived, missingLinkedIn, missingSeo, missingCover, recent] = await Promise.all([
    Article.countDocuments({ status: 'draft' }),
    Article.countDocuments({ status: 'scheduled' }),
    Article.countDocuments({ status: 'published' }),
    Article.countDocuments({ status: 'archived' }),
    Article.countDocuments({ $or: [{ linkedinSummary: '' }, { linkedinSummary: { $exists: false } }] }),
    Article.countDocuments({ $or: [{ seoTitle: '' }, { seoTitle: { $exists: false } }, { seoDescription: '' }, { seoDescription: { $exists: false } }] }),
    Article.countDocuments({ $or: [{ coverImage: '' }, { coverImage: { $exists: false } }] }),
    Article.find().sort({ updatedAt: -1 }).limit(6).lean(),
  ]);
  return { draft, scheduled, published, archived, missingLinkedIn, missingSeo, missingCover, recent };
}

export async function homepageContent() {
  const [articles, caseStudies, projects, videos] = await Promise.all([
    Article.find({ status: 'published' }).sort({ publishedAt: -1 }).limit(3).lean(),
    CaseStudy.find({ status: 'published' }).sort({ featured: -1, updatedAt: -1 }).limit(3).lean(),
    Project.find({ status: { $in: ['active', 'maintained', 'experimental'] } }).sort({ featured: -1, order: 1 }).limit(3).lean(),
    Video.find({ status: 'published' }).sort({ publishedAt: -1 }).limit(3).lean(),
  ]);
  return { articles, caseStudies, projects, videos };
}
