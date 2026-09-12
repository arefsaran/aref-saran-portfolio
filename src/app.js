import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import helmet from 'helmet';
import lusca from 'lusca';
import path from 'node:path';
import fs from 'node:fs';
import mongoose from 'mongoose';
import { fileURLToPath } from 'node:url';
import publicRouter from './routes/public.js';
import adminRouter from './routes/admin.js';
import { notFound, errorHandler } from './middleware/errors.js';
import { getSiteSettings } from './services/settings.js';
import { safeJsonForHtml } from './utils/json.js';

const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(directory, '..');

export function createApp(config) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', config.trustProxy);
  app.set('view engine', 'ejs');
  app.set('views', path.join(directory, 'views'));
  app.locals.baseUrl = config.baseUrl.replace(/\/$/, '');
  app.locals.learningGermanUrl = 'https://learninggerman.ir';
  app.locals.jsonLd = safeJsonForHtml;

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        frameSrc: ['https://www.youtube-nocookie.com', 'https://www.youtube.com'],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  app.use((_req, res, next) => {
    res.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.get('/ready', (_req, res) => {
    const ready = mongoose.connection.readyState === 1;
    res.status(ready ? 200 : 503).json({ ready });
  });

  app.use(express.static(path.join(root, 'public'), { maxAge: config.mode === 'production' ? '7d' : 0 }));
  fs.mkdirSync(path.resolve(config.uploadDir), { recursive: true });
  app.use('/uploads', express.static(path.resolve(config.uploadDir), { maxAge: config.mode === 'production' ? '30d' : 0 }));
  app.use(express.urlencoded({ extended: false, limit: '1mb' }));
  app.use(express.json({ limit: '1mb' }));

  app.use(session({
    name: 'as.sid',
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: config.mongoUri, ttl: 60 * 60 * 24 * 7 }),
    cookie: {
      httpOnly: true,
      secure: config.mode === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 12,
    },
  }));

  app.use(lusca.csrf());
  app.use(async (req, res, next) => {
    try {
      res.locals.csrfToken = res.locals._csrf;
      res.locals.isAdmin = Boolean(req.session?.adminId);
      res.locals.currentPath = req.path;
      res.locals.baseUrl = app.locals.baseUrl;
      res.locals.preview = false;
      res.locals.settings = await getSiteSettings();
      res.locals.learningGermanUrl = res.locals.settings.learningGermanUrl;
      next();
    } catch (error) { next(error); }
  });

  app.use('/admin', adminRouter);
  app.use(publicRouter);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
