const VerificationHistory = require('../models/VerificationHistory');
const DeepfakeResult = require('../models/DeepfakeResult');

/**
 * Return unified verification history (news + deepfake) for authenticated user.
 */
exports.getAll = async (req, res, next) => {
  try {
    const news = await VerificationHistory.find({ user: req.user._id }).lean();
    const images = await DeepfakeResult.find({ user: req.user._id }).lean();
    // unify format
    const unified = [];
    news.forEach(n => unified.push({
      id: n._id,
      type: 'news',
      createdAt: n.createdAt,
      result: n.result,
      sourceUrl: n.sourceUrl,
      details: n.details
    }));
    images.forEach(i => unified.push({
      id: i._id,
      type: 'deepfake',
      createdAt: i.createdAt,
      result: i.label,
      filename: i.filename,
      details: i.details
    }));
    unified.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(unified);
  } catch (err) {
    next(err);
  }
};

/**
 * Return a single verification record (news or deepfake) by id.
 */
exports.getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let item = await VerificationHistory.findById(id);
    if (item) return res.json({ type: 'news', item });
    item = await DeepfakeResult.findById(id);
    if (item) return res.json({ type: 'deepfake', item });
    return res.status(404).json({ error: 'Not found' });
  } catch (err) {
    next(err);
  }
};
