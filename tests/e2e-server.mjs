import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { createApp } from '../src/app.js';
import { Admin } from '../src/models/Admin.js';
import { Article } from '../src/models/Article.js';

const mongo = await MongoMemoryServer.create();
const mongoUri = mongo.getUri();
await mongoose.connect(mongoUri);
await Admin.create({ email: 'admin@example.com', passwordHash: await bcrypt.hash('testing-password-123', 10) });
await Article.create({ title: 'Published Engineering Note', slug: 'published-engineering-note', excerpt: 'A safe public article used by browser tests.', body: '# Public article\n\nBusiness state matters.', status: 'published', publishedAt: new Date(), tags: ['API Testing'], series: 'Test Engineering Notes' });

const app = createApp({ mode: 'test', port: 4173, baseUrl: 'http://127.0.0.1:4173', mongoUri, sessionSecret: 'test-session-secret-that-is-long-enough', trustProxy: false, uploadDir: './uploads-test' });
const server = app.listen(4173, '127.0.0.1', () => console.log('E2E server ready'));

const stop = async () => {
  await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
  await mongo.stop();
  process.exit(0);
};
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
