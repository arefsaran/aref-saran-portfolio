import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'default' },
  siteTitle: { type: String, default: 'Aref Saran — Senior QA / Test Automation Engineer' },
  defaultSeoDescription: { type: String, default: 'Senior QA and Test Automation Engineer specializing in FinTech, credit and payments: API, integration, database, E2E, performance and CI/CD quality engineering.' },
  authorName: { type: String, default: 'Aref Saran' },
  publicEmail: { type: String, default: 'arefsaran@gmail.com' },
  githubUrl: { type: String, default: 'https://github.com/arefsaran' },
  linkedinUrl: { type: String, default: 'https://linkedin.com/in/arefsaran' },
  youtubeUrl: { type: String, default: '' },
  cvUrl: { type: String, default: '/resume/Aref_Saran_QA_Engineer.pdf' },
  learningGermanUrl: { type: String, default: 'https://learninggerman.ir' },
  opportunityText: { type: String, default: 'Open to Senior QA opportunities in Germany and Europe' },
  defaultOgImage: { type: String, default: '/og-card-v2.png' },
}, { timestamps: true });

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
