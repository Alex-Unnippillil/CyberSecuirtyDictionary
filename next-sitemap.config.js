const fs = require('fs');
const path = require('path');

const terms = JSON.parse(fs.readFileSync(path.join(__dirname, 'terms.json'), 'utf8')).terms;

function slugify(term) {
  return term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

module.exports = {
  siteUrl: 'https://alex-unnippillil.github.io/CyberSecuirtyDictionary',
  generateRobotsTxt: true,
  sitemapSize: 45000,
  additionalPaths: async () =>
    terms
      .filter(t => !t.draft)
      .map(t => ({ loc: `/terms/${slugify(t.term)}.html` })),
};
