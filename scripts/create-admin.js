import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../src/config/env.js';
import { Admin } from '../src/models/Admin.js';

if (!config.adminPassword || config.adminPassword.length < 12) {
  throw new Error('Set ADMIN_PASSWORD to at least 12 characters before running npm run admin:create.');
}

await mongoose.connect(config.mongoUri);
const passwordHash = await bcrypt.hash(config.adminPassword, 12);
await Admin.findOneAndUpdate(
  { email: config.adminEmail },
  { email: config.adminEmail, passwordHash },
  { upsert: true, new: true, setDefaultsOnInsert: true },
);
console.log(`Admin ready: ${config.adminEmail}`);
await mongoose.disconnect();
