const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const DATA_FILE = path.join(__dirname, '..', 'data', 'terms.yaml');
const OUTPUT_JSON = path.join(__dirname, '..', 'terms.json');
const TERMS_DIR = path.join(__dirname, '..', 'terms');

function loadTerms() {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return yaml.load(raw);
}

function computeDepth(term, map, cache) {
  if (cache[term.slug] !== undefined) {
    return cache[term.slug];
  }
  const prereqs = term.prerequisites || [];
  if (!prereqs.length) {
    cache[term.slug] = 0;
    return 0;
  }
  const depth = 1 + Math.max(...prereqs.map((slug) => computeDepth(map[slug], map, cache)));
  cache[term.slug] = depth;
  return depth;
}

function difficultyLabel(score) {
  if (score <= 1) return 'Easy';
  if (score <= 3) return 'Intermediate';
  return 'Hard';
}

function build() {
  const terms = loadTerms();
  const map = {};
  terms.forEach((t) => (map[t.slug] = t));

  const cache = {};
  terms.forEach((term) => {
    const depth = computeDepth(term, map, cache);
    const edits = (term.edit_history || []).length;
    const score = depth + edits;
    const label = difficultyLabel(score);
    term.difficulty = { score, label };
  });

  fs.mkdirSync(TERMS_DIR, { recursive: true });

  terms.forEach((term) => {
    const html =
      '<!DOCTYPE html>\n' +
      '<html lang="en">\n' +
      '<head>\n' +
      '  <meta charset="UTF-8">\n' +
      '  <link rel="stylesheet" href="../styles.css">\n' +
      '  <title>' + term.name + '</title>\n' +
      '</head>\n' +
      '<body>\n' +
      '  <h1>' +
      term.name +
      ' <span class="difficulty-badge difficulty-' +
      term.difficulty.label.toLowerCase() +
      '">' +
      term.difficulty.label +
      '</span></h1>\n' +
      '  <p>' + term.definition + '</p>\n' +
      '</body>\n' +
      '</html>\n';
    fs.writeFileSync(path.join(TERMS_DIR, term.slug + '.html'), html);
  });

  const json = {
    terms: terms.map((t) => ({
      term: t.name,
      definition: t.definition,
      difficulty: t.difficulty,
    })),
  };
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(json, null, 2));
}

build();

