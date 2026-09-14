import 'dotenv/config';

function asInt(value, fallback, name) {
  const raw = value ?? String(fallback);
  if (!/^\d+$/.test(raw)) throw new Error(`${name} must be an integer.`);
  return Number(raw);
}

const mode = process.env.NODE_ENV || 'development';
if (!['development', 'test', 'production'].includes(mode)) throw new Error('NODE_ENV must be development, test, or production.');

if (!['0', '1'].includes(process.env.TRUST_PROXY ?? '0')) throw new Error('TRUST_PROXY must be 0 or 1.');

export const config = {
  mode,
  port: asInt(process.env.PORT, 4173, 'PORT'),
  baseUrl: process.env.BASE_URL || 'http://127.0.0.1:4173',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/arefsaran',
  sessionSecret: process.env.SESSION_SECRET || 'development-only-change-me-development-only',
  trustProxy: process.env.TRUST_PROXY === '1' ? 1 : false,
  adminEmail: (process.env.ADMIN_EMAIL || 'arefsaran@gmail.com').trim().toLowerCase(),
  adminPassword: process.env.ADMIN_PASSWORD || '',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  maxUploadBytes: asInt(process.env.MAX_UPLOAD_MB, 5, 'MAX_UPLOAD_MB') * 1024 * 1024,
  adminTimezone: process.env.ADMIN_TIMEZONE || 'Asia/Tehran',
};

if (config.mode === 'production') {
  const normalizedSecret = config.sessionSecret.trim().toLowerCase();
  const unsafeSecrets = new Set(['secret', 'password', 'change-me', 'development-secret']);
  if (config.sessionSecret.length < 32 || unsafeSecrets.has(normalizedSecret) || normalizedSecret.startsWith('replace-with') || normalizedSecret.startsWith('development-only')) {
    throw new Error('SESSION_SECRET must be at least 32 characters and must not use a known placeholder in production.');
  }
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required in production.');
  let baseUrl;
  try {
    baseUrl = new URL(config.baseUrl);
  } catch {
    throw new Error('BASE_URL must be a valid absolute URL in production.');
  }
  if (baseUrl.protocol !== 'https:' || baseUrl.username || baseUrl.password) {
    throw new Error('BASE_URL must be an HTTPS origin without embedded credentials in production.');
  }
  if (baseUrl.pathname !== '/' || baseUrl.search || baseUrl.hash) {
    throw new Error('BASE_URL must be an origin without a path, query, or fragment in production.');
  }
}

if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) throw new Error('PORT must be an integer from 1 to 65535.');
if (!Number.isInteger(config.maxUploadBytes) || config.maxUploadBytes < 1) throw new Error('MAX_UPLOAD_MB must be a positive integer.');
try {
  new Intl.DateTimeFormat('en', { timeZone: config.adminTimezone });
} catch {
  throw new Error('ADMIN_TIMEZONE must be a valid IANA timezone.');
}
