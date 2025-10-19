const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sheetSchema = new Schema({
  title: { type: String, required: true },
  composer: { type: String, required: true },
  description: { type: String, required: true },
  instrument: { type: String, required: true },
  genre: { type: String, required: true },
  difficulty: { type: String, required: true },
  duration: { type: String },
  key: { type: String },
  tempo: { type: String },
  period: { type: String },
  pages: { type: Number },
  tags: [String],
  isPublic: { type: Boolean, default: true },
  fileUrl: { type: String }, // For PDF/music files
  imageUrl: { type: String }, // For preview images
  uploader: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sheet', sheetSchema);