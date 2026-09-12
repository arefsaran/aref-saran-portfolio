import express from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { Admin } from '../models/Admin.js';
import { Article } from '../models/Article.js';
import { CaseStudy } from '../models/CaseStudy.js';
import { Project } from '../models/Project.js';
import { Video } from '../models/Video.js';
import { Media } from '../models/Media.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { defaultSiteSettings } from '../services/settings.js';
import { requireAdmin, redirectIfAuthenticated } from '../middleware/auth.js';
import { makeSlug } from '../utils/slug.js';
import { buildLinkedInDraft } from '../utils/linkedin.js';
import { renderMarkdown, estimateReadingTime } from '../utils/markdown.js';
import { safeHttpUrl, safeEmail } from '../utils/url.js';
import { dashboardStats } from '../services/content.js';

const router = express.Router();

router.use((_req, res, next) => {
  res.set('X-Robots-Tag', 'noindex, nofollow');
  res.set('Cache-Control', 'private, no-store');
  next();
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many sign-in attempts. Try again later.',
});

function cleanList(value) {
  if (Array.isArray(value)) value = value.join(',');
  return String(value || '')
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, all) => all.findIndex((x) => x.toLowerCase() === item.toLowerCase()) === index);
}

function cleanIds(value) {
  if (!value) return [];
  const list = Array.isArray(value) ? value : [value];
  return list.map((item) => String(item).trim()).filter((item) => /^[a-f0-9]{24}$/i.test(item));
}

function dateValue(value) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? undefined : date;
}

async function ensureArticleSlugAvailable(slug, articleId) {
  const collision = await Article.exists({
    ...(articleId ? { _id: { $ne: articleId } } : {}),
    $or: [{ slug }, { oldSlugs: slug }],
  });
  if (collision) {
    const error = new Error('That slug is already in use.');
    error.code = 11000;
    throw error;
  }
}

async function contentChoices() {
  const [caseStudies, projects, videos] = await Promise.all([
    CaseStudy.find({ status: { $ne: 'archived' } }).sort({ title: 1 }).lean(),
    Project.find({ status: { $ne: 'archived' } }).sort({ name: 1 }).lean(),
    Video.find({ status: { $ne: 'archived' } }).sort({ title: 1 }).lean(),
  ]);
  return { caseStudies, projects, videos };
}

function articlePayload(body, existing) {
  const nextSlug = makeSlug(body.slug || body.title) || existing?.slug;
  return {
    title: String(body.title || '').trim(),
    slug: nextSlug,
    subtitle: String(body.subtitle || '').trim(),
    excerpt: String(body.excerpt || '').trim(),
    body: String(body.body || ''),
    coverImage: safeHttpUrl(body.coverImage, { allowRelative: true }),
    tags: cleanList(body.tags),
    series: String(body.series || '').trim(),
    status: ['draft', 'scheduled', 'published', 'archived'].includes(body.status) ? body.status : 'draft',
    featured: body.featured === 'on' || body.featured === true,
    publishedAt: dateValue(body.publishedAt),
    scheduledAt: dateValue(body.scheduledAt),
    canonicalUrl: safeHttpUrl(body.canonicalUrl),
    seoTitle: String(body.seoTitle || '').trim(),
    seoDescription: String(body.seoDescription || '').trim(),
    ogImage: safeHttpUrl(body.ogImage, { allowRelative: true }),
    linkedinHook: String(body.linkedinHook || '').trim(),
    linkedinSummary: String(body.linkedinSummary || '').trim(),
    linkedinKeyPoints: cleanList(body.linkedinKeyPoints),
    linkedinCTA: String(body.linkedinCTA || '').trim(),
    linkedinHashtags: cleanList(body.linkedinHashtags),
    linkedinStatus: ['not_created', 'draft', 'ready', 'posted'].includes(body.linkedinStatus) ? body.linkedinStatus : 'not_created',
    linkedinPostedAt: dateValue(body.linkedinPostedAt),
    linkedinPostUrl: safeHttpUrl(body.linkedinPostUrl),
    language: ['en', 'de', 'fa'].includes(body.language) ? body.language : 'en',
    germanSummary: String(body.germanSummary || '').trim(),
    internalNotes: String(body.internalNotes || '').trim(),
    relatedCaseStudies: cleanIds(body.relatedCaseStudies),
    relatedProjects: cleanIds(body.relatedProjects),
    relatedVideos: cleanIds(body.relatedVideos),
  };
}

router.get('/login', redirectIfAuthenticated, (req, res) => {
  res.render('admin/login', { title: 'Admin sign in', error: null });
});

router.post('/login', redirectIfAuthenticated, loginLimiter, async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const admin = await Admin.findOne({ email });
    const ok = admin && await bcrypt.compare(String(req.body.password || ''), admin.passwordHash);
    if (!ok) return res.status(401).render('admin/login', { title: 'Admin sign in', error: 'Invalid email or password.' });
    admin.lastLoginAt = new Date();
    await admin.save();
    req.session.regenerate((error) => {
      if (error) return next(error);
      req.session.adminId = String(admin._id);
      req.session.save((saveError) => saveError ? next(saveError) : res.redirect('/admin'));
    });
  } catch (error) { next(error); }
});

router.post('/logout', requireAdmin, (req, res, next) => {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie('as.sid');
    res.redirect('/admin/login');
  });
});

router.use(requireAdmin);

router.get('/', async (_req, res, next) => {
  try {
    const stats = await dashboardStats();
    res.render('admin/dashboard', { title: 'Admin dashboard', stats });
  } catch (error) { next(error); }
});

router.get('/articles', async (req, res, next) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.series) query.series = req.query.series;
    if (req.query.tag) query.tags = req.query.tag;
    if (req.query.featured === 'true') query.featured = true;
    if (req.query.featured === 'false') query.featured = false;
    if (req.query.missing === 'linkedin') query.$or = [{ linkedinSummary: '' }, { linkedinSummary: { $exists: false } }];
    if (req.query.missing === 'seo') query.$or = [{ seoTitle: '' }, { seoTitle: { $exists: false } }, { seoDescription: '' }, { seoDescription: { $exists: false } }];
    if (req.query.missing === 'cover') query.$or = [{ coverImage: '' }, { coverImage: { $exists: false } }];
    if (req.query.q) query.$text = { $search: String(req.query.q) };
    const sortOptions = { updated: { updatedAt: -1 }, created: { createdAt: -1 }, published: { publishedAt: -1 }, title: { title: 1 } };
    const articles = await Article.find(query).sort(sortOptions[req.query.sort] || sortOptions.updated).lean();
    const [series, tags] = await Promise.all([Article.distinct('series', { series: { $nin: [null, ''] } }), Article.distinct('tags')]);
    res.render('admin/articles-list', { title: 'Articles', articles, series, tags, filters: req.query });
  } catch (error) { next(error); }
});

router.get('/articles/new', async (_req, res, next) => {
  try {
    const choices = await contentChoices();
    res.render('admin/article-edit', { title: 'New article', article: null, linkedinDraft: '', readingTime: 1, error: null, ...choices });
  } catch (error) { next(error); }
});

router.post('/articles', async (req, res, next) => {
  try {
    const payload = articlePayload(req.body);
    if (!payload.title || !payload.slug || !payload.excerpt || !payload.body || (payload.status === 'scheduled' && !payload.scheduledAt)) {
      const choices = await contentChoices();
      const message = payload.status === 'scheduled' && !payload.scheduledAt ? 'Scheduled articles require a schedule date.' : 'Title, slug, excerpt and article body are required.';
      return res.status(422).render('admin/article-edit', { title: 'New article', article: { ...payload }, linkedinDraft: '', readingTime: estimateReadingTime(payload.body), error: message, ...choices });
    }
    if (payload.status === 'published' && !payload.publishedAt) payload.publishedAt = new Date();
    await ensureArticleSlugAvailable(payload.slug);
    const article = await Article.create(payload);
    res.redirect(`/admin/articles/${article._id}?saved=1`);
  } catch (error) {
    if (error?.code === 11000) {
      const choices = await contentChoices();
      return res.status(409).render('admin/article-edit', { title: 'New article', article: articlePayload(req.body), linkedinDraft: '', readingTime: estimateReadingTime(req.body.body), error: 'That slug is already in use.', ...choices });
    }
    next(error);
  }
});

router.get('/articles/:id', async (req, res, next) => {
  try {
    const [article, choices] = await Promise.all([Article.findById(req.params.id).lean(), contentChoices()]);
    if (!article) return next();
    res.render('admin/article-edit', { title: `Edit · ${article.title}`, article, linkedinDraft: buildLinkedInDraft(article, req.app.locals.baseUrl), readingTime: estimateReadingTime(article.body), error: null, saved: req.query.saved === '1', ...choices });
  } catch (error) { next(error); }
});

router.post('/articles/:id', async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return next();
    const payload = articlePayload(req.body, article);
    if (!payload.title || !payload.slug || !payload.excerpt || !payload.body || (payload.status === 'scheduled' && !payload.scheduledAt)) {
      const choices = await contentChoices();
      const message = payload.status === 'scheduled' && !payload.scheduledAt ? 'Scheduled articles require a schedule date.' : 'Title, slug, excerpt and article body are required.';
      return res.status(422).render('admin/article-edit', { title: `Edit · ${payload.title || 'Article'}`, article: { ...article.toObject(), ...payload }, linkedinDraft: buildLinkedInDraft(payload, req.app.locals.baseUrl), readingTime: estimateReadingTime(payload.body), error: message, ...choices });
    }
    if (article.slug !== payload.slug && article.status === 'published' && !article.oldSlugs.includes(article.slug)) article.oldSlugs.push(article.slug);
    await ensureArticleSlugAvailable(payload.slug, article._id);
    article.oldSlugs = article.oldSlugs.filter((slug) => slug !== payload.slug);
    article.revisions.push({ title: article.title, excerpt: article.excerpt, body: article.body, savedAt: new Date() });
    if (article.revisions.length > 20) article.revisions = article.revisions.slice(-20);
    Object.assign(article, payload);
    if (article.status === 'published' && !article.publishedAt) article.publishedAt = new Date();
    await article.save();
    res.redirect(`/admin/articles/${article._id}?saved=1`);
  } catch (error) {
    if (error?.code === 11000) {
      const article = await Article.findById(req.params.id).lean();
      const choices = await contentChoices();
      return res.status(409).render('admin/article-edit', { title: `Edit · ${article?.title || 'Article'}`, article: { ...article, ...articlePayload(req.body, article) }, linkedinDraft: '', readingTime: estimateReadingTime(req.body.body), error: 'That slug is already in use.', ...choices });
    }
    next(error);
  }
});

router.get('/articles/:id/preview', async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id).populate([{ path: 'relatedCaseStudies', match: { status: 'published' } }, { path: 'relatedProjects', match: { status: { $ne: 'archived' } } }, { path: 'relatedVideos', match: { status: 'published' } }]).lean();
    if (!article) return next();
    res.set('X-Robots-Tag', 'noindex, nofollow');
    res.render('articles/show', { title: `[Preview] ${article.title}`, description: article.excerpt, canonical: null, ogImage: article.ogImage || article.coverImage, article, html: renderMarkdown(article.body), readingTime: estimateReadingTime(article.body), related: [], preview: true });
  } catch (error) { next(error); }
});

router.post('/articles/:id/linkedin-generate', async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return next();
    if (!article.linkedinHook) article.linkedinHook = article.excerpt || article.title;
    if (!article.linkedinSummary) article.linkedinSummary = article.excerpt;
    if (!article.linkedinKeyPoints?.length) {
      article.linkedinKeyPoints = article.body.split(/\n+/).map((line) => line.replace(/^#+\s*/, '').trim()).filter((line) => line.length > 25 && line.length < 150).slice(0, 4);
    }
    if (!article.linkedinCTA) article.linkedinCTA = `Read the full engineering note: ${req.app.locals.baseUrl}/articles/${article.slug}`;
    if (!article.linkedinHashtags?.length) article.linkedinHashtags = ['SoftwareTesting', 'TestAutomation', 'QualityEngineering'];
    article.linkedinStatus = 'draft';
    await article.save();
    res.redirect(`/admin/articles/${article._id}?saved=1#linkedin`);
  } catch (error) { next(error); }
});

router.post('/articles/:id/revisions/:index/restore', async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return next();
    const index = Number.parseInt(req.params.index, 10);
    const revision = Number.isInteger(index) ? article.revisions[index] : null;
    if (!revision) return res.status(404).send('Revision not found');
    article.revisions.push({ title: article.title, excerpt: article.excerpt, body: article.body, savedAt: new Date() });
    article.title = revision.title;
    article.excerpt = revision.excerpt;
    article.body = revision.body;
    if (article.revisions.length > 20) article.revisions = article.revisions.slice(-20);
    await article.save();
    res.redirect(`/admin/articles/${article._id}?saved=1`);
  } catch (error) { next(error); }
});

router.post('/articles/:id/duplicate', async (req, res, next) => {
  try {
    const source = await Article.findById(req.params.id).lean();
    if (!source) return next();
    const base = makeSlug(`${source.slug}-copy`);
    let slug = base;
    let suffix = 2;
    while (await Article.exists({ slug })) slug = `${base}-${suffix++}`;
    const duplicate = await Article.create({
      title: `${source.title} — Copy`, slug, subtitle: source.subtitle, excerpt: source.excerpt, body: source.body,
      coverImage: source.coverImage, tags: source.tags, series: source.series, status: 'draft', featured: false,
      seoTitle: '', seoDescription: '', ogImage: source.ogImage, linkedinHook: source.linkedinHook,
      linkedinSummary: source.linkedinSummary, linkedinKeyPoints: source.linkedinKeyPoints,
      linkedinCTA: '', linkedinHashtags: source.linkedinHashtags, linkedinStatus: 'draft', language: source.language,
      germanSummary: source.germanSummary, internalNotes: source.internalNotes,
    });
    res.redirect(`/admin/articles/${duplicate._id}?saved=1`);
  } catch (error) { next(error); }
});

router.post('/articles/:id/archive', async (req, res, next) => {
  try {
    await Article.findByIdAndUpdate(req.params.id, { status: 'archived' });
    res.redirect('/admin/articles');
  } catch (error) { next(error); }
});


router.get('/settings', async (_req, res, next) => {
  try {
    const stored = await SiteSettings.findOne({ key: 'default' }).lean();
    res.render('admin/settings', { title: 'Site settings', site: { ...defaultSiteSettings, ...(stored || {}) }, saved: false });
  } catch (error) { next(error); }
});

router.post('/settings', async (req, res, next) => {
  try {
    const payload = {
      siteTitle: String(req.body.siteTitle || '').trim(),
      defaultSeoDescription: String(req.body.defaultSeoDescription || '').trim(),
      authorName: String(req.body.authorName || '').trim(),
      publicEmail: safeEmail(req.body.publicEmail) || defaultSiteSettings.publicEmail,
      githubUrl: safeHttpUrl(req.body.githubUrl) || defaultSiteSettings.githubUrl,
      linkedinUrl: safeHttpUrl(req.body.linkedinUrl) || defaultSiteSettings.linkedinUrl,
      youtubeUrl: safeHttpUrl(req.body.youtubeUrl),
      cvUrl: safeHttpUrl(req.body.cvUrl),
      learningGermanUrl: safeHttpUrl(req.body.learningGermanUrl) || defaultSiteSettings.learningGermanUrl,
      opportunityText: String(req.body.opportunityText || '').trim(),
      defaultOgImage: safeHttpUrl(req.body.defaultOgImage, { allowRelative: true }) || defaultSiteSettings.defaultOgImage,
    };
    const site = await SiteSettings.findOneAndUpdate({ key: 'default' }, { key: 'default', ...payload }, { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }).lean();
    res.render('admin/settings', { title: 'Site settings', site: { ...defaultSiteSettings, ...site }, saved: true });
  } catch (error) { next(error); }
});

router.get('/taxonomy', async (_req, res, next) => {
  try {
    const [tags, series] = await Promise.all([
      Article.distinct('tags'),
      Article.distinct('series', { series: { $nin: [null, ''] } }),
    ]);
    res.render('admin/taxonomy', { title: 'Tags & series', tags: tags.sort(), series: series.sort(), message: null });
  } catch (error) { next(error); }
});

router.post('/taxonomy/tag/rename', async (req, res, next) => {
  try {
    const from = String(req.body.from || '').trim();
    const to = String(req.body.to || '').trim();
    if (from && to && from.toLowerCase() !== to.toLowerCase()) {
      const articles = await Article.find({ tags: from });
      for (const article of articles) {
        article.tags = article.tags.map((tag) => tag === from ? to : tag).filter((tag, index, all) => all.findIndex((x) => x.toLowerCase() === tag.toLowerCase()) === index);
        await article.save();
      }
    }
    res.redirect('/admin/taxonomy');
  } catch (error) { next(error); }
});

router.post('/taxonomy/tag/delete', async (req, res, next) => {
  try {
    const tag = String(req.body.tag || '').trim();
    if (tag) await Article.updateMany({ tags: tag }, { $pull: { tags: tag } });
    res.redirect('/admin/taxonomy');
  } catch (error) { next(error); }
});

router.post('/taxonomy/series/rename', async (req, res, next) => {
  try {
    const from = String(req.body.from || '').trim();
    const to = String(req.body.to || '').trim();
    if (from && to) await Article.updateMany({ series: from }, { $set: { series: to } });
    res.redirect('/admin/taxonomy');
  } catch (error) { next(error); }
});

router.post('/taxonomy/series/delete', async (req, res, next) => {
  try {
    const series = String(req.body.series || '').trim();
    if (series) await Article.updateMany({ series }, { $set: { series: '' } });
    res.redirect('/admin/taxonomy');
  } catch (error) { next(error); }
});

router.get('/export/content.json', async (_req, res, next) => {
  try {
    const [articles, caseStudies, projects, videos] = await Promise.all([Article.find().lean(), CaseStudy.find().lean(), Project.find().lean(), Video.find().lean()]);
    res.attachment(`arefsaran-content-${new Date().toISOString().slice(0, 10)}.json`).json({ exportedAt: new Date().toISOString(), articles, caseStudies, projects, videos });
  } catch (error) { next(error); }
});

router.get('/articles/:id/export.md', async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id).lean();
    if (!article) return next();
    const frontmatter = `---\ntitle: ${JSON.stringify(article.title)}\nslug: ${article.slug}\nstatus: ${article.status}\ntags: ${JSON.stringify(article.tags || [])}\nseries: ${JSON.stringify(article.series || '')}\n---\n\n`;
    res.type('text/markdown').attachment(`${article.slug}.md`).send(frontmatter + article.body);
  } catch (error) { next(error); }
});

const uploadRoot = path.resolve(process.env.UPLOAD_DIR || './uploads');
fs.mkdirSync(uploadRoot, { recursive: true });
const allowedMimes = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '');
    cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: Number(process.env.MAX_UPLOAD_MB || 5) * 1024 * 1024 }, fileFilter: (_req, file, cb) => allowedMimes.has(file.mimetype) ? cb(null, true) : cb(new Error('Unsupported image type.')) });

function imageSignatureMatches(filePath, mimeType) {
  const bytes = fs.readFileSync(filePath).subarray(0, 12);
  const hex = bytes.toString('hex');
  if (mimeType === 'image/png') return hex.startsWith('89504e470d0a1a0a');
  if (mimeType === 'image/jpeg') return hex.startsWith('ffd8ff');
  if (mimeType === 'image/gif') return bytes.subarray(0, 6).toString('ascii') === 'GIF87a' || bytes.subarray(0, 6).toString('ascii') === 'GIF89a';
  if (mimeType === 'image/webp') return bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP';
  return false;
}

router.get('/media', async (_req, res, next) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 }).lean();
    res.render('admin/media', { title: 'Media', media, error: null });
  } catch (error) { next(error); }
});

router.post('/media', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(422).render('admin/media', { title: 'Media', media: await Media.find().sort({ createdAt: -1 }).lean(), error: 'Choose a supported image.' });
    if (!imageSignatureMatches(req.file.path, req.file.mimetype)) {
      fs.unlinkSync(req.file.path);
      return res.status(422).render('admin/media', { title: 'Media', media: await Media.find().sort({ createdAt: -1 }).lean(), error: 'The uploaded file does not match its declared image type.' });
    }
    await Media.create({ filename: req.file.filename, originalName: req.file.originalname, url: `/uploads/${req.file.filename}`, mimeType: req.file.mimetype, size: req.file.size, alt: String(req.body.alt || '').trim(), caption: String(req.body.caption || '').trim() });
    res.redirect('/admin/media');
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    next(error);
  }
});

router.post('/media/:id/delete', async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return next();
    const references = await Promise.all([
      Article.countDocuments({ $or: [{ coverImage: media.url }, { ogImage: media.url }] }),
      Project.countDocuments({ coverImage: media.url }),
      Video.countDocuments({ thumbnail: media.url }),
    ]);
    if (references.some(Boolean)) {
      const items = await Media.find().sort({ createdAt: -1 }).lean();
      return res.status(409).render('admin/media', { title: 'Media', media: items, error: 'This image is referenced by published/content records and was not deleted.' });
    }
    const filePath = path.join(uploadRoot, media.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await media.deleteOne();
    res.redirect('/admin/media');
  } catch (error) { next(error); }
});

router.get('/case-studies', async (req, res, next) => {
  try {
    const [items, editing] = await Promise.all([
      CaseStudy.find().sort({ updatedAt: -1 }).lean(),
      req.query.edit ? CaseStudy.findById(req.query.edit).lean() : null,
    ]);
    res.render('admin/case-studies', { title: 'Case studies', items, editing, error: null });
  } catch (error) { next(error); }
});
router.post('/case-studies', async (req, res, next) => {
  try {
    const payload = {
      title: String(req.body.title || '').trim(), slug: makeSlug(req.body.slug || req.body.title), summary: String(req.body.summary || '').trim(), problem: req.body.problem, context: req.body.context, constraints: req.body.constraints, risks: req.body.risks, approach: req.body.approach, architecture: req.body.architecture, implementation: req.body.implementation, validation: req.body.validation, result: req.body.result, lessons: req.body.lessons, technologies: cleanList(req.body.technologies), status: req.body.status || 'draft', featured: req.body.featured === 'on',
    };
    if (req.body.id) await CaseStudy.findByIdAndUpdate(req.body.id, payload, { runValidators: true });
    else await CaseStudy.create(payload);
    res.redirect('/admin/case-studies');
  } catch (error) { next(error); }
});
router.post('/case-studies/:id/archive', async (req, res, next) => {
  try { await CaseStudy.findByIdAndUpdate(req.params.id, { status: 'archived' }); res.redirect('/admin/case-studies'); } catch (error) { next(error); }
});

router.get('/projects', async (req, res, next) => {
  try {
    const [items, editing] = await Promise.all([
      Project.find().sort({ order: 1, updatedAt: -1 }).lean(),
      req.query.edit ? Project.findById(req.query.edit).lean() : null,
    ]);
    res.render('admin/projects', { title: 'Projects', items, editing, error: null });
  } catch (error) { next(error); }
});
router.post('/projects', async (req, res, next) => {
  try {
    const payload = { name: String(req.body.name || '').trim(), slug: makeSlug(req.body.slug || req.body.name), summary: String(req.body.summary || '').trim(), description: req.body.description, status: req.body.status || 'planned', technologies: cleanList(req.body.technologies), githubUrl: safeHttpUrl(req.body.githubUrl), liveUrl: safeHttpUrl(req.body.liveUrl), featured: req.body.featured === 'on', order: Number(req.body.order || 0) };
    if (req.body.id) await Project.findByIdAndUpdate(req.body.id, payload, { runValidators: true });
    else await Project.create(payload);
    res.redirect('/admin/projects');
  } catch (error) { next(error); }
});
router.post('/projects/:id/archive', async (req, res, next) => {
  try { await Project.findByIdAndUpdate(req.params.id, { status: 'archived' }); res.redirect('/admin/projects'); } catch (error) { next(error); }
});

router.get('/videos', async (req, res, next) => {
  try {
    const [items, editing] = await Promise.all([
      Video.find().sort({ publishedAt: -1, updatedAt: -1 }).lean(),
      req.query.edit ? Video.findById(req.query.edit).lean() : null,
    ]);
    res.render('admin/videos', { title: 'Videos', items, editing, error: null });
  } catch (error) { next(error); }
});
router.post('/videos', async (req, res, next) => {
  try {
    const payload = { title: String(req.body.title || '').trim(), slug: makeSlug(req.body.slug || req.body.title), youtubeUrl: safeHttpUrl(req.body.youtubeUrl), youtubeId: req.body.youtubeId, description: req.body.description, publishedAt: dateValue(req.body.publishedAt), topic: req.body.topic, series: req.body.series, thumbnail: safeHttpUrl(req.body.thumbnail, { allowRelative: true }), status: req.body.status || 'draft' };
    if (req.body.id) await Video.findByIdAndUpdate(req.body.id, payload, { runValidators: true });
    else await Video.create(payload);
    res.redirect('/admin/videos');
  } catch (error) { next(error); }
});
router.post('/videos/:id/archive', async (req, res, next) => {
  try { await Video.findByIdAndUpdate(req.params.id, { status: 'archived' }); res.redirect('/admin/videos'); } catch (error) { next(error); }
});

export default router;
