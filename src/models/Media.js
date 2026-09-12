import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  url: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  alt: String,
  caption: String,
}, { timestamps: true });

export const Media = mongoose.model('Media', mediaSchema);
