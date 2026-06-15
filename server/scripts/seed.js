const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const VerificationHistory = require('../models/VerificationHistory');
const DeepfakeResult = require('../models/DeepfakeResult');

dotenv.config();

async function seed() {
  await connectDB();
  await User.deleteMany({});
  await VerificationHistory.deleteMany({});
  await DeepfakeResult.deleteMany({});

  const password = await bcrypt.hash('password123', 10);
  const user = new User({ name: 'Demo User', email: 'demo@example.com', password });
  await user.save();

  const v1 = new VerificationHistory({ user: user._id, sourceUrl: 'https://example.com/news/1', result: 'Likely Authentic', details: { score: 85 } });
  await v1.save();
  const d1 = new DeepfakeResult({ user: user._id, filename: 'demo.jpg', originalName: 'demo.jpg', path: 'uploads/demo.jpg', deepfakeProbability: 20, confidence: 0.8, label: 'Likely Authentic', explanation: 'Seed data' });
  await d1.save();

  console.log('Seed complete. Demo user: demo@example.com / password123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
