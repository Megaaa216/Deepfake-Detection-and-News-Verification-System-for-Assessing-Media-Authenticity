const VerificationHistory = require('../models/VerificationHistory');
const DeepfakeResult = require('../models/DeepfakeResult');

/**
 * Return unified verification history (news + deepfake) for authenticated user.
 */
exports.getAll = async (req, res, next) => {
  try {
    const news = await VerificationHistory.find({ user: req.user._id }).lean();
    const images = await DeepfakeResult.find({ user: req.user._id }).lean();

    // Map backend records to the frontend `VerificationResult` shape
    const mappedNews = news.map(n => ({
      id: n._id.toString(),
      type: 'news_link',
      targetName: n.sourceUrl,
      date: (n.createdAt || n.updatedAt) ? new Date(n.createdAt || n.updatedAt).toISOString().replace('T', ' ').substring(0, 16) : new Date().toISOString().replace('T', ' ').substring(0, 16),
      riskScore: n.details && n.details.score ? n.details.score : 0,
      status: n.result || 'suspicious',
      verdict: (n.details && n.details.analysis && n.details.analysis.summary) ? n.details.analysis.summary : (n.details && n.details.analysis ? JSON.stringify(n.details.analysis).slice(0, 200) : 'News verification completed.'),
      recommendation: n.details && n.details.recommendation ? n.details.recommendation : (n.result === 'likely_authentic' ? 'Low concern. Read safely.' : 'Verify before sharing.'),
      reasons: (n.details && n.details.analysis && n.details.analysis.reasons) ? n.details.analysis.reasons : [],
      size: 'URL',
      duration: undefined,
      sourceCategory: (n.details && n.details.sourceCategory) ? n.details.sourceCategory : undefined,
    }));

    const mappedImages = images.map(i => ({
      id: i._id.toString(),
      type: i.type || 'image',
      targetName: i.originalName || i.filename,
      date: (i.createdAt || i.updatedAt) ? new Date(i.createdAt || i.updatedAt).toISOString().replace('T', ' ').substring(0, 16) : new Date().toISOString().replace('T', ' ').substring(0, 16),
      riskScore: typeof i.deepfakeProbability === 'number' ? Math.round(i.deepfakeProbability * 100) : (i.riskScore || 0),
      status: (typeof i.deepfakeProbability === 'number') ? (i.deepfakeProbability * 100 < 20 ? 'likely_authentic' : i.deepfakeProbability * 100 < 70 ? 'suspicious' : 'likely_deepfake') : (i.label || 'suspicious'),
      verdict: i.explanation || i.verdict || 'Deepfake analysis completed.',
      recommendation: (i.deepfakeProbability && i.deepfakeProbability >= 0.7) ? 'Critical Concern. Do not distribute.' : 'Review findings and verify further.',
      reasons: i.details && i.details.reasons ? i.details.reasons : [],
      size: i.size || undefined,
      duration: i.duration || undefined,
      sourceCategory: undefined,
    }));

    const unified = [...mappedNews, ...mappedImages];
    unified.sort((a,b) => new Date(b.date) - new Date(a.date));
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
    if (item) {
      const mapped = {
        id: item._id.toString(),
        type: 'news_link',
        targetName: item.sourceUrl,
        date: item.createdAt ? new Date(item.createdAt).toISOString().replace('T', ' ').substring(0, 16) : undefined,
        riskScore: item.details && item.details.score ? item.details.score : 0,
        status: item.result || 'suspicious',
        verdict: (item.details && item.details.analysis && item.details.analysis.summary) ? item.details.analysis.summary : undefined,
        recommendation: item.details && item.details.recommendation ? item.details.recommendation : undefined,
        reasons: item.details && item.details.analysis && item.details.analysis.reasons ? item.details.analysis.reasons : [],
        size: 'URL',
        duration: undefined,
        sourceCategory: item.details && item.details.sourceCategory ? item.details.sourceCategory : undefined,
      };
      return res.json(mapped);
    }

    item = await DeepfakeResult.findById(id);
    if (item) {
      const mapped = {
        id: item._id.toString(),
        type: item.type || 'image',
        targetName: item.originalName || item.filename,
        date: item.createdAt ? new Date(item.createdAt).toISOString().replace('T', ' ').substring(0, 16) : undefined,
        riskScore: typeof item.deepfakeProbability === 'number' ? Math.round(item.deepfakeProbability * 100) : (item.riskScore || 0),
        status: (typeof item.deepfakeProbability === 'number') ? (item.deepfakeProbability * 100 < 20 ? 'likely_authentic' : item.deepfakeProbability * 100 < 70 ? 'suspicious' : 'likely_deepfake') : (item.label || 'suspicious'),
        verdict: item.explanation || item.verdict || undefined,
        recommendation: (item.deepfakeProbability && item.deepfakeProbability >= 0.7) ? 'Critical Concern. Do not distribute.' : 'Review findings and verify further.',
        reasons: item.details && item.details.reasons ? item.details.reasons : [],
        size: item.size || undefined,
        duration: item.duration || undefined,
        sourceCategory: undefined,
      };
      return res.json(mapped);
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (err) {
    next(err);
  }
};
