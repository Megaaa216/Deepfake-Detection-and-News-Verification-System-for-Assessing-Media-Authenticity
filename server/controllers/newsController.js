const newsService = require('../services/newsService');
const VerificationHistory = require('../models/VerificationHistory');

/**
 * Verify a news article URL: fetch, analyze, compute score, save, and return result.
 */
exports.verifyNews = async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });
    const article = await newsService.fetchArticle(url);
    const analysis = await newsService.analyzeArticle(article);
    const score = newsService.computeScore(analysis);
    const label = newsService.labelForScore(score);

    const record = new VerificationHistory({
      user: req.user ? req.user._id : null,
      sourceUrl: url,
      result: label,
      details: { article, analysis, score },
    });
    await record.save();

    res.json({ id: record._id, result: label, score, analysis });
  } catch (err) {
    next(err);
  }
};

/**
 * Return all news verification records for the authenticated user.
 */
exports.getHistory = async (req, res, next) => {
  try {
    const items = await VerificationHistory.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

/**
 * Return a single verification record by id.
 */
exports.getById = async (req, res, next) => {
  try {
    const item = await VerificationHistory.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};
