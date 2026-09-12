import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  youtubeUrl: String,
  youtubeId: String,
  description: String,
  publishedAt: Date,
  topic: String,
  series: String,
  thumbnail: String,
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
}, { timestamps: true });

export const Video = mongoose.model('Video', videoSchema);
