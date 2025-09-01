const fs = require('fs');

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

const termsPath = 'terms.json';
const outputPath = 'tfidf.json';

const raw = JSON.parse(fs.readFileSync(termsPath, 'utf8'));
const terms = Array.isArray(raw) ? raw : raw.terms;

const docs = terms.map(t => tokenize(t.definition || ''));
const df = {};
docs.forEach(doc => {
  const unique = new Set(doc);
  unique.forEach(w => {
    df[w] = (df[w] || 0) + 1;
  });
});

const N = terms.length;
const vectors = {};
const norms = {};
const keywords = {};

terms.forEach((term, i) => {
  const tf = {};
  docs[i].forEach(w => {
    tf[w] = (tf[w] || 0) + 1;
  });
  const vector = {};
  const len = docs[i].length;
  Object.keys(tf).forEach(w => {
    const idf = Math.log(N / df[w]);
    vector[w] = (tf[w] / len) * idf;
  });
  vectors[term.term] = vector;
  const norm = Math.sqrt(Object.values(vector).reduce((sum, v) => sum + v * v, 0));
  norms[term.term] = norm;
  const top = Object.entries(vector)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([w]) => w);
  keywords[term.term] = top;
});

fs.writeFileSync(outputPath, JSON.stringify({ vectors, norms, keywords }, null, 2));
