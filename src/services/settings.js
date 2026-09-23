import { SiteSettings } from '../models/SiteSettings.js';

export const defaultSiteSettings = Object.freeze({
  siteTitle: 'Aref Saran — Senior QA / Test Automation Engineer',
  defaultSeoDescription: 'Senior QA and Test Automation Engineer specializing in FinTech, credit and payments: API, integration, database, E2E, performance and CI/CD quality engineering.',
  authorName: 'Aref Saran',
  publicEmail: 'arefsaran@gmail.com',
  githubUrl: 'https://github.com/arefsaran',
  linkedinUrl: 'https://linkedin.com/in/arefsaran',
  youtubeUrl: '',
  cvUrl: '/resume/Aref_Saran_QA_Engineer.pdf',
  learningGermanUrl: 'https://learninggerman.ir',
  opportunityText: 'Open to Senior QA opportunities in Germany and Europe',
  defaultOgImage: '/og-card-v2.png',
});

export async function getSiteSettings() {
  const stored = await SiteSettings.findOne({ key: 'default' }).lean();
  return {
    ...defaultSiteSettings,
    ...(stored || {}),
    cvUrl: stored?.cvUrl || defaultSiteSettings.cvUrl,
  };
}
