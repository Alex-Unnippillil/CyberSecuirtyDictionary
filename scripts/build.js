const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const dataPath = path.join(__dirname, '..', 'data', 'terms.yaml');
const terms = yaml.load(fs.readFileSync(dataPath, 'utf8'));

const termsDir = path.join(__dirname, '..', 'terms');
fs.mkdirSync(termsDir, { recursive: true });

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function renderFooter(sources = [], lastReviewed) {
  const reviewed = lastReviewed instanceof Date
    ? lastReviewed.toISOString().split('T')[0]
    : lastReviewed;
  if ((!sources || sources.length === 0) && !reviewed) {
    return '';
  }
  const sourcesHtml = sources.length
    ? `\n    <p>Sources: ${sources
        .map(
          (s) => `<a href="${s}" target="_blank" rel="noopener noreferrer">${s}</a>`
        )
        .join(', ')}</p>`
    : '';
  const reviewedHtml = reviewed ? `\n    <p>Last reviewed: ${reviewed}</p>` : '';
  return `\n  <footer class="provenance-footer">${sourcesHtml}${reviewedHtml}\n  </footer>`;
}

for (const term of terms) {
  const slug = term.slug || slugify(term.name);
  const footer = renderFooter(term.sources || [], term.last_reviewed);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${term.name}</title>
</head>
<body>
  <h1>${term.name}</h1>
  <p>${term.definition}</p>${footer}
</body>
</html>`;
  fs.writeFileSync(path.join(termsDir, `${slug}.html`), html);
}
