// Placeholder Gemini service. Real Gemini integration should call the
// official API with proper authentication. For now this returns a
// lightweight, deterministic analysis to keep the pipeline functional.

/**
 * analyzeText - basic local analysis returning a short summary and flags.
 * Replace implementation with an authenticated call to Gemini / LLM service.
 */
async function analyzeText(text) {
  // If a GEMINI_API_KEY is provided, implement an API call here and return
  // a JSON object containing summary and any model-derived signals.
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
