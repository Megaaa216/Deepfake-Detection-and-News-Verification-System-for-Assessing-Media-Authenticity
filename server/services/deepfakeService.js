const fs = require('fs');

// Placeholder deepfake analyzer.
// Replace this with a call to a local ML model (PyTorch/TensorFlow serving)
// or an external detection API. The placeholder returns deterministic
// values derived from file size so front-end integration can be tested.
async function analyzeImage(filePath) {
  let stats;
  try {
    stats = fs.statSync(filePath);
  } catch (err) {
    throw new Error('Unable to read uploaded file');
  }
  const sizeKb = Math.max(1, Math.round(stats.size / 1024));
  const probability = Math.max(0, Math.min(100, Math.round(50 + (sizeKb % 50) - 10)));
  const confidence = Math.max(0.1, Math.min(0.99, Number((probability / 100).toFixed(2))));
  const label = probability >= 70 ? 'High Risk' : (probability >= 40 ? 'Suspicious' : 'Likely Authentic');
  const explanation = `Heuristic placeholder: file size ${sizeKb}KB contributed to score.`;
  return { probability, confidence, label, explanation };
}

module.exports = { analyzeImage };
