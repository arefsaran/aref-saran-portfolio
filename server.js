import mongoose from 'mongoose';
import { config } from './src/config/env.js';
import { createApp } from './src/app.js';
import { Article } from './src/models/Article.js';

await mongoose.connect(config.mongoUri);
console.log('Connected to MongoDB');

const app = createApp(config);
const server = app.listen(config.port, '0.0.0.0', () => {
  console.log(`arefsaran.ir listening on port ${config.port}`);
});

const scheduler = setInterval(async () => {
  try {
    const now = new Date();
    await Article.updateMany(
      { status: 'scheduled', scheduledAt: { $lte: now } },
      [{ $set: { status: 'published', publishedAt: { $ifNull: ['$publishedAt', now] } } }],
    );
  } catch (error) {
    console.error('Scheduled publication check failed', error);
  }
}, 60_000);
scheduler.unref();

let shuttingDown = false;
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received; shutting down`);
  clearInterval(scheduler);
  const timeout = setTimeout(() => {
    console.error('Graceful shutdown timed out');
    process.exit(1);
  }, 10_000);
  timeout.unref();
  try {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await mongoose.disconnect();
    globalThis.clearTimeout(timeout);
    process.exit(0);
  } catch (error) {
    console.error('Graceful shutdown failed', error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
