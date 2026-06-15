const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');
const gemini = require('./geminiService');
const trusted = require('../config/trusted_sources.json');

async function fetchArticle(url) {
  const res = await axios.get(url, { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = res.data;
  const $ = cheerio.load(html);
  const title = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
  // naive content extraction: collect <p> text
  let content = '';
  $('article p, p').each((i, el) => {
    const txt = $(el).text().trim();
    if (txt.length > 50) content += txt + '\n\n';
  });
  if (!content) content = $('body').text().slice(0, 2000);
  const domain = new URL(url).hostname.replace(/^www\./, '');
  return { url, title: title.trim(), domain, content: content.trim() };
}

function checkSourceCredibility(domain) {
  // simple list check
  if (trusted.high.includes(domain)) return { score: 90, reason: 'Trusted source' };
  if (trusted.medium.includes(domain)) return { score: 65, reason: 'Known source' };
  if (trusted.low.includes(domain)) return { score: 30, reason: 'Low trust source' };
  return { score: 50, reason: 'Unknown source' };
}

function domainReputation(domain) {
  // heuristic: suspicious TLDs and long domain names
  const tld = domain.split('.').pop();
  const suspiciousTlds = ['xyz', 'top', 'click', 'info'];
  let score = 60;
  if (suspiciousTlds.includes(tld)) score -= 25;
  if (domain.length > 30) score -= 10;
  return { score: Math.max(10, score), reason: 'Heuristic domain reputation' };
}

function suspiciousLanguageAnalysis(content) {
  const indicators = ['click here', 'shocking', 'you won\'t believe', 'miracle', 'guarantee'];
  let count = 0;
  const lower = content.toLowerCase();
  indicators.forEach((w) => { if (lower.includes(w)) count++; });
  const exclamations = (content.match(/!/g) || []).length;
  const score = Math.max(0, 80 - count * 20 - exclamations * 5);
  return { score, count, exclamations, reason: 'Suspicious language heuristics' };
}

async function findSimilarNews(article) {
  // Placeholder: real implementation would query news/search APIs.
  // We'll check trusted sources list for the domain and return none for now.
  return { matches: [], reason: 'Not implemented: external news search' };
}

async function analyzeArticle(article) {
  const source = checkSourceCredibility(article.domain);
  const domain = domainReputation(article.domain);
  const language = suspiciousLanguageAnalysis(article.content);
  const similar = await findSimilarNews(article);
  // Optionally augment with Gemini (placeholder)
  const geminiAnalysis = await gemini.analyzeText(
    `Please analyze this article for credibility and suspicious content:\nTitle: ${article.title}\nContent: ${article.content.slice(0, 2000)}`
  );

  return { source, domain, language, similar, gemini: geminiAnalysis };
}

function computeScore(analysis) {
  // Weighted aggregation
  // source: 35, domain: 20, language: 25, similar: 20
  const s = analysis.source.score;
  const d = analysis.domain.score;
  const l = analysis.language.score;
  const simBonus = (analysis.similar.matches && analysis.similar.matches.length > 0) ? 15 : 0;
  const raw = (s * 0.35) + (d * 0.2) + (l * 0.25) + (simBonus);
  return Math.round(Math.max(0, Math.min(100, raw)));
}

function labelForScore(score) {
  if (score >= 76) return 'Likely Authentic';
  if (score >= 40) return 'Suspicious';
  return 'High Risk';
}

module.exports = { fetchArticle, analyzeArticle, computeScore, labelForScore };
