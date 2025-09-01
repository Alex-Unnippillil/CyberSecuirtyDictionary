const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const yamlPath = path.join(__dirname, '..', 'data', 'terms.yaml');
const termsOutput = path.join(__dirname, '..', 'terms.json');
const countsOutput = path.join(__dirname, '..', 'counts.json');

const raw = fs.readFileSync(yamlPath, 'utf8');
const items = yaml.load(raw);

const terms = [];
const counts = {
  byDomain: {},
  byDifficulty: {},
  byFramework: {}
};

for (const item of items) {
  const term = {
    term: item.name,
    definition: item.definition
  };

  if (item.domain) {
    term.domain = item.domain;
    counts.byDomain[item.domain] = (counts.byDomain[item.domain] || 0) + 1;
  }
  if (item.difficulty) {
    term.difficulty = item.difficulty;
    counts.byDifficulty[item.difficulty] = (counts.byDifficulty[item.difficulty] || 0) + 1;
  }
  if (item.frameworks) {
    term.frameworks = item.frameworks;
    for (const fw of item.frameworks) {
      counts.byFramework[fw] = (counts.byFramework[fw] || 0) + 1;
    }
  }

  terms.push(term);
}

fs.writeFileSync(termsOutput, JSON.stringify({ terms }, null, 2));
fs.writeFileSync(countsOutput, JSON.stringify(counts, null, 2));
