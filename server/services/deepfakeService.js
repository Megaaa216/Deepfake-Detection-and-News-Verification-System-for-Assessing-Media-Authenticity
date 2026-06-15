const fs = require('fs');

// Placeholder deepfake analyzer. Replace with real model inference or
// external API integration. The function returns a deterministic result
// based on file size so behaviour is testable.

async function analyzeImage(filePath) {
  // simple heuristic: larger files -> more likely authentic (placeholder)
  let stats;
  try {
    stats = fs.statSync(filePath);
  } catch (err) {
    throw new Error('Unable to read uploaded file');
  }
  const sizeKb = Math.max(1, Math.round(stats.size / 1024));
  const probability = Math.max(0, Math.min(100, Math.round(50 + (sizeKb % 50) - 10)));
  const confidence = Math.max(0.1, Math.min(0.99, (probability / 100).toFixed(2)));
  const label = probability >= 70 ? 'High Risk' : (probability >= 40 ? 'Suspicious' : 'Likely Authentic');
  const explanation = `Heuristic placeholder: file size ${sizeKb}KB contributed to score.`;
  return { probability, confidence: Number(confidence), label, explanation };
}

module.exports = { analyzeImage };
