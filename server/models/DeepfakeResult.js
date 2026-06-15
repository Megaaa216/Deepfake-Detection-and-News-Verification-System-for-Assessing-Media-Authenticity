const mongoose = require('mongoose');

const deepfakeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    filename: { type: String },
    originalName: { type: String },
    path: { type: String },
    deepfakeProbability: { type: Number },
    confidence: { type: Number },
    label: { type: String },
    explanation: { type: String },
    details: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DeepfakeResult', deepfakeSchema);
