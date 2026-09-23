import express from 'express';
import { Article } from '../models/Article.js';
import { CaseStudy } from '../models/CaseStudy.js';
import { Project } from '../models/Project.js';
import { Video } from '../models/Video.js';
import { renderMarkdown, estimateReadingTime } from '../utils/markdown.js';
import { homepageContent } from '../services/content.js';

const router = express.Router();
const escapeXml = (value = '') => String(value).replace(/[<>&'\"]/g, (character) => ({
  '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
}[character]));

router.get('/', async (req, res, next) => {
  try {
    const content = await homepageContent();
    res.render('home', { layout: false, ...content });
  } catch (error) { next(error); }
});

const profilePages = {
  experience: {
    title: 'Experience',
    description: 'Aref Saran’s QA Engineering experience across FinTech, credit, payments and e-commerce.',
  },
  expertise: {
    title: 'Expertise',
    description: 'QA and Test Automation expertise across financial workflows, APIs, integrations, data, CI/CD and performance.',
  },
  about: {
    title: 'About',
    description: 'About Aref Saran, a Senior QA and Test Automation Engineer specializing in FinTech, credit and payments.',
  },
  contact: {
    title: 'Contact',
    description: 'Contact Aref Saran about Senior QA and Test Automation opportunities in Germany and Europe.',
  },
};

Object.entries(profilePages).forEach(([page, metadata]) => {
  router.get(`/${page}`, (_req, res) => res.render('profile', {
    page,
    ...metadata,
    canonical: `${res.app.locals.baseUrl}/${page}`,
  }));
});

router.get('/writing', (_req, res) => res.redirect(301, '/articles'));
router.get('/writing/:slug', (req, res) => res.redirect(301, `/articles/${encodeURIComponent(req.params.slug)}`));

router.get('/articles', async (req, res, next) => {
  try {
    const query = { status: 'published' };
    if (req.query.series) query.series = req.query.series;
    if (req.query.tag) query.tags = req.query.tag;
    if (req.query.q) query.$text = { $search: String(req.query.q) };
    const articles = await Article.find(query).sort({ featured: -1, publishedAt: -1 }).lean();
    const series = await Article.distinct('series', { status: 'published', series: { $nin: [null, ''] } });
    const tags = await Article.distinct('tags', { status: 'published' });
    res.render('articles/index', { title: 'Engineering Articles', description: 'Technical notes on software testing, automation architecture, API reliability, FinTech quality and performance engineering.', articles, series, tags, filters: req.query });
  } catch (error) { next(error); }
});

router.get('/articles/:slug', async (req, res, next) => {
  try {
    let article = await Article.findOne({ slug: req.params.slug, status: 'published' }).populate([{ path: 'relatedCaseStudies', match: { status: 'published' } }, { path: 'relatedProjects', match: { status: { $ne: 'archived' } } }, { path: 'relatedVideos', match: { status: 'published' } }]).lean();
    if (!article) {
      const moved = await Article.findOne({ oldSlugs: req.params.slug, status: 'published' }).lean();
      if (moved) return res.redirect(301, `/articles/${moved.slug}`);
      return next();
    }
    const related = await Article.find({ _id: { $ne: article._id }, status: 'published', $or: [{ series: article.series }, { tags: { $in: article.tags || [] } }] }).sort({ publishedAt: -1 }).limit(3).lean();
    res.render('articles/show', {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
      canonical: article.canonicalUrl || `${req.app.locals.baseUrl}/articles/${article.slug}`,
      ogImage: article.ogImage || article.coverImage,
      article,
      html: renderMarkdown(article.body),
      readingTime: estimateReadingTime(article.body),
      related,
    });
  } catch (error) { next(error); }
});

router.get('/case-studies', async (_req, res, next) => {
  try {
    const items = await CaseStudy.find({ status: 'published' }).sort({ featured: -1, updatedAt: -1 }).lean();
    res.render('case-studies/index', { title: 'Case Studies', description: 'Generalized Test Engineering case studies focused on architecture, risk, reliability and measurable outcomes.', items });
  } catch (error) { next(error); }
});

router.get('/projects', async (_req, res, next) => {
  try {
    const items = await Project.find({ status: { $ne: 'archived' } }).sort({ featured: -1, order: 1, updatedAt: -1 }).lean();
    res.render('projects/index', { title: 'Engineering Projects', description: 'Public and planned Test Engineering projects by Aref Saran.', items });
  } catch (error) { next(error); }
});

router.get('/videos', async (_req, res, next) => {
  try {
    const items = await Video.find({ status: 'published' }).sort({ publishedAt: -1 }).lean();
    res.render('videos/index', { title: 'Technical Videos', description: 'Technical video material on Test Engineering, automation, API reliability and performance.', items });
  } catch (error) { next(error); }
});

router.get('/api/public/articles', async (_req, res, next) => {
  try {
    const articles = await Article.find({ status: 'published' }).select('title slug excerpt publishedAt series tags').sort({ publishedAt: -1 }).limit(6).lean();
    res.json({ articles });
  } catch (error) { next(error); }
});

router.get('/rss.xml', async (_req, res, next) => {
  try {
    const articles = await Article.find({ status: 'published' }).sort({ publishedAt: -1 }).limit(50).lean();
    const base = res.app.locals.baseUrl;
    const items = articles.map((article) => {
      const url = `${base}/articles/${encodeURIComponent(article.slug)}`;
      return `<item><title>${escapeXml(article.title)}</title><link>${escapeXml(url)}</link><guid>${escapeXml(url)}</guid><description>${escapeXml(article.excerpt)}</description>${article.publishedAt ? `<pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>` : ''}</item>`;
    }).join('');
    res.type('application/rss+xml').send(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Aref Saran — QA Engineering Writing</title><link>${escapeXml(base)}/articles</link><description>Technical writing on FinTech quality engineering, test automation, APIs, CI/CD and performance.</description>${items}</channel></rss>`);
  } catch (error) { next(error); }
});

router.get('/sitemap.xml', async (_req, res, next) => {
  try {
    const [articles, cases, projects] = await Promise.all([
      Article.find({ status: 'published' }).select('slug updatedAt').lean(),
      CaseStudy.find({ status: 'published' }).select('slug updatedAt').lean(),
      Project.find({ status: { $ne: 'archived' } }).select('slug updatedAt').lean(),
    ]);
    const base = res.app.locals.baseUrl;
    const urls = [
      ['', new Date()], ['/experience', new Date()], ['/expertise', new Date()], ['/about', new Date()], ['/contact', new Date()], ['/articles', new Date()], ['/rss.xml', new Date()], ['/case-studies', new Date()], ['/projects', new Date()], ['/videos', new Date()],
      ...articles.map((a) => [`/articles/${a.slug}`, a.updatedAt]),
      ...cases.map((a) => [`/case-studies#${a.slug}`, a.updatedAt]),
      ...projects.map((a) => [`/projects#${a.slug}`, a.updatedAt]),
    ];
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(([path, date]) => `<url><loc>${base}${path}</loc><lastmod>${new Date(date).toISOString()}</lastmod></url>`).join('')}</urlset>`);
  } catch (error) { next(error); }
});

export default router;
