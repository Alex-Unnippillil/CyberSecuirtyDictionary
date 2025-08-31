const fs = require('fs');
const path = require('path');

const termsPath = path.join(__dirname, '..', 'terms.json');
const outputPath = path.join(__dirname, '..', 'terms.index.json');

const { terms } = JSON.parse(fs.readFileSync(termsPath, 'utf8'));

function slugify(term) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const baseUrl = 'https://alex-unnippillil.github.io/CyberSecuirtyDictionary/terms';

const index = terms.map(t => {
  const slug = slugify(t.term);
  return {
    term: t.term,
    definition: t.definition,
    slug,
    url: `${baseUrl}/${slug}.html`
  };
});

fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
