import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'default' },
  siteTitle: { type: String, default: 'Aref Saran — Test Engineer' },
  defaultSeoDescription: { type: String, default: 'Test Engineering portfolio focused on automation architecture, API and integration testing, FinTech quality, performance engineering and CI/CD.' },
  authorName: { type: String, default: 'Aref Saran' },
  publicEmail: { type: String, default: 'arefsaran@gmail.com' },
  githubUrl: { type: String, default: 'https://github.com/arefsaran' },
  linkedinUrl: { type: String, default: 'https://linkedin.com/in/arefsaran' },
  youtubeUrl: { type: String, default: '' },
  cvUrl: { type: String, default: '' },
  learningGermanUrl: { type: String, default: 'https://learninggerman.ir' },
  opportunityText: { type: String, default: 'Open to Test Engineering opportunities in Germany' },
  defaultOgImage: { type: String, default: '/og-card-v2.png' },
}, { timestamps: true });

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
