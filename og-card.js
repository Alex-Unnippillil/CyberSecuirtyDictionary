const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Load term data from YAML file
const termsPath = path.join(__dirname, 'data', 'terms.yaml');
const terms = yaml.load(fs.readFileSync(termsPath, 'utf8'));

function slugify(term) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Route handler that returns an SVG Open Graph card for a term.
 * The card displays the term title and any associated tags (category or tags field).
 *
 * @param {Object} req - Request-like object. Supported fields: params.slug or query.slug
 * @param {Object} res - Response-like object. Must implement setHeader() and end().
 */
function ogCardHandler(req, res) {
  const slug =
    (req && req.params && req.params.slug) ||
    (req && req.query && (req.query.slug || req.query.term));

  const term = terms.find(t => t.slug === slug || slugify(t.name) === slug);

  if (!term) {
    res.statusCode = 404;
    res.setHeader && res.setHeader('Content-Type', 'text/plain');
    res.end('Term not found');
    return;
  }

  const tags = [];
  if (Array.isArray(term.tags)) {
    tags.push(...term.tags);
  }
  if (term.category) {
    tags.push(term.category);
  }

  const tagText = tags.join(', ');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">\n` +
    `  <rect width="1200" height="630" fill="#0d1b2a"/>\n` +
    `  <text x="60" y="200" font-size="72" font-family="Arial, Helvetica, sans-serif" fill="#ffffff">${term.name}</text>\n` +
    `  <text x="60" y="300" font-size="36" font-family="Arial, Helvetica, sans-serif" fill="#66fcf1">${tagText}</text>\n` +
    `</svg>`;

  res.setHeader && res.setHeader('Content-Type', 'image/svg+xml');
  res.end(svg);
}

module.exports = ogCardHandler;
