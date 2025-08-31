const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'terms.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const oembedDir = path.join(__dirname, '..', 'oembed');
fs.mkdirSync(oembedDir, { recursive: true });

const providerName = 'Cyber Security Dictionary';
const providerUrl = 'https://alex-unnippillil.github.io/CyberSecuirtyDictionary';

function slugify(term) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

for (const entry of data.terms) {
  const slug = slugify(entry.term);
  const url = `${providerUrl}#${encodeURIComponent(entry.term)}`;
  const oembed = {
    version: '1.0',
    type: 'rich',
    provider_name: providerName,
    provider_url: providerUrl,
    title: entry.term,
    html: `<div><strong>${entry.term}:</strong> ${entry.definition} <a href="${url}">Read more</a></div>`
  };
  fs.writeFileSync(path.join(oembedDir, `${slug}.json`), JSON.stringify(oembed, null, 2));
}

console.log(`Generated ${data.terms.length} oEmbed responses.`);

// Generate a generic oEmbed for the homepage
const home = {
  version: '1.0',
  type: 'link',
  provider_name: providerName,
  provider_url: providerUrl,
  title: providerName,
};
fs.writeFileSync(path.join(oembedDir, 'index.json'), JSON.stringify(home, null, 2));
