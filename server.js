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

async function shutdown(signal) {
  console.log(`${signal} received; shutting down`);
  clearInterval(scheduler);
  await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
