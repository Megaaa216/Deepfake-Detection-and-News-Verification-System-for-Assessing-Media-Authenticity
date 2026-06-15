const mongoose = require('mongoose');

const verificationHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sourceUrl: { type: String },
    result: { type: String },
    details: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VerificationHistory', verificationHistorySchema);
