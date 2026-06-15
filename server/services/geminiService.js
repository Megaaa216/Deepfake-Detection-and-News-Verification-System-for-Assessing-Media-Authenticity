// Placeholder Gemini service. Real Gemini integration should call the
// official API with proper authentication. For now this returns a
// lightweight, deterministic analysis to keep the pipeline functional.

async function analyzeText(text) {
  // If a GEMINI_API_KEY is provided, one could implement a call here.
  // We'll return a simple analysis summary.
  const summary = text.slice(0, 500).replace(/\s+/g, ' ').slice(0, 300) + '...';
  const suspiciousTerms = ['click here', 'shocking', 'conspiracy', 'deepfake'];
  const flags = suspiciousTerms.filter((t) => text.toLowerCase().includes(t));
  return {
    summary: `Auto-summary: ${summary}`,
    flags,
    note: 'This is a local placeholder analysis. Replace with Gemini API calls when available.'
  };
}

module.exports = { analyzeText };
