import { SiteSettings } from '../models/SiteSettings.js';

export const defaultSiteSettings = Object.freeze({
  siteTitle: 'Aref Saran — Test Engineer',
  defaultSeoDescription: 'Test Engineering portfolio focused on automation architecture, API and integration testing, FinTech quality, performance engineering and CI/CD.',
  authorName: 'Aref Saran',
  publicEmail: 'arefsaran@gmail.com',
  githubUrl: 'https://github.com/arefsaran',
  linkedinUrl: 'https://linkedin.com/in/arefsaran',
  youtubeUrl: '',
  cvUrl: '',
  learningGermanUrl: 'https://learninggerman.ir',
  opportunityText: 'Open to Test Engineering opportunities in Germany',
  defaultOgImage: '/og-card-v2.png',
});

export async function getSiteSettings() {
  const stored = await SiteSettings.findOne({ key: 'default' }).lean();
  return { ...defaultSiteSettings, ...(stored || {}) };
}
