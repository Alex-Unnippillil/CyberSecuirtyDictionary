const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const dataDir = path.join(__dirname, '..', 'data');
const termsPath = path.join(dataDir, 'terms.yaml');
const acronymsPath = path.join(dataDir, 'acronyms.json');

const terms = yaml.load(fs.readFileSync(termsPath, 'utf8'));
let acronyms = {};
if (fs.existsSync(acronymsPath)) {
  acronyms = JSON.parse(fs.readFileSync(acronymsPath, 'utf8'));
}

const termsWithSynonyms = terms.map(term => {
  const name = term.name || term.term || '';
  const synonyms = term.synonyms ? [...term.synonyms] : [];
  for (const [acronym, expansion] of Object.entries(acronyms)) {
    if (expansion.toLowerCase() === name.toLowerCase()) {
      synonyms.push(acronym);
    }
  }
  return { ...term, synonyms };
});

const output = { terms: termsWithSynonyms };
fs.writeFileSync(path.join(__dirname, '..', 'terms.json'), JSON.stringify(output, null, 2));
