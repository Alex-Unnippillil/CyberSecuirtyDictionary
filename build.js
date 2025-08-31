const fs = require('fs');
const path = require('path');
const { kmeans } = require('ml-kmeans');

// Source data describing the dictionary terms
const dataPath = path.join(__dirname, 'terms.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Directory where individual term pages will be written
const termsDir = path.join(__dirname, 'terms');
fs.mkdirSync(termsDir, { recursive: true });

const baseUrl = 'https://alex-unnippillil.github.io/CyberSecuirtyDictionary/terms';

const urls = [];

function slugify(term) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

for (const term of data.terms) {
  const slug = slugify(term.term);
  const metaRobots = term.draft ? '<meta name="robots" content="noindex">' : '';
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${term.term}</title>
  ${metaRobots}
</head>
<body>
  <h1>${term.term}</h1>
  <p>${term.definition}</p>
</body>
</html>`;
  fs.writeFileSync(path.join(termsDir, `${slug}.html`), html);
  if (!term.draft) {
    urls.push(`${baseUrl}/${slug}.html`);
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);

// -----------------------------
// Generate simple embeddings for each term definition and cluster them
// -----------------------------

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

// Build a vocabulary from all term definitions
const vocab = new Map();
for (const term of data.terms) {
  for (const token of tokenize(term.definition)) {
    if (!vocab.has(token)) {
      vocab.set(token, vocab.size);
    }
  }
}

const vocabSize = vocab.size;

// Convert each definition into a bag-of-words vector
function embed(text) {
  const vector = new Array(vocabSize).fill(0);
  for (const token of tokenize(text)) {
    const index = vocab.get(token);
    if (index !== undefined) {
      vector[index] += 1;
    }
  }
  return vector;
}

const embeddings = data.terms.map(t => embed(t.definition));

// Choose at least 5 clusters (or more if there are many terms)
const k = Math.max(5, Math.round(Math.sqrt(embeddings.length)));
const kmeansResult = kmeans(embeddings, k);

const clusterData = kmeansResult.centroids.map((centroid, idx) => {
  const members = data.terms
    .filter((_, i) => kmeansResult.clusters[i] === idx)
    .map(t => t.term);
  return {
    centroid: centroid.map(v => +v.toFixed(3)),
    members
  };
});

fs.writeFileSync(
  path.join(__dirname, 'clusters.json'),
  JSON.stringify({ clusters: clusterData }, null, 2)
);
