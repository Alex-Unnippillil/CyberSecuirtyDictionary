const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const dataPath = path.join(__dirname, '..', 'data', 'terms.yaml');
const outPath = path.join(__dirname, '..', 'terms.json');

const file = fs.readFileSync(dataPath, 'utf8');
const terms = yaml.load(file);

// validate see_also references
const names = new Set(terms.map(t => t.name));
for (const term of terms) {
  if (term.see_also) {
    for (const ref of term.see_also) {
      if (!names.has(ref)) {
        throw new Error(`Unknown see_also reference '${ref}' in term '${term.name}'`);
      }
    }
  }
}

const json = {
  terms: terms.map(t => ({ term: t.name, definition: t.definition }))
};

fs.writeFileSync(outPath, JSON.stringify(json, null, 2));
