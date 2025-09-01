const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const terms = yaml.load(fs.readFileSync(path.join(__dirname, 'data', 'terms.yaml'), 'utf8'));
const termsDir = path.join(__dirname, 'terms');
fs.mkdirSync(termsDir, { recursive: true });

const nameToSlug = {};
for (const t of terms) {
  nameToSlug[t.name] = t.slug;
}

function autolink(text) {
  const names = Object.keys(nameToSlug).sort((a, b) => b.length - a.length);
  let result = text;
  for (const name of names) {
    const slug = nameToSlug[name];
    const regex = new RegExp(`\\b${name}\\b`, 'g');
    result = result.replace(regex, `<a href="${slug}.html">${name}</a>`);
  }
  return result;
}

const baseUrl = 'https://alex-unnippillil.github.io/CyberSecuirtyDictionary/terms';
const urls = [];

for (const term of terms) {
  const { name, slug, definition, see_also = [], draft } = term;
  const metaRobots = draft ? '<meta name="robots" content="noindex">' : '';
  const linkedDef = autolink(definition);
  let seeAlsoHtml = '';
  if (see_also.length) {
    seeAlsoHtml = '<h2>See Also</h2><ul>' +
      see_also.map(ref => {
        const refSlug = nameToSlug[ref];
        return `<li><a href="${refSlug}.html">${ref}</a></li>`;
      }).join('') + '</ul>';
  }
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${name}</title>
  ${metaRobots}
</head>
<body>
  <h1>${name}</h1>
  <p>${linkedDef}</p>
  ${seeAlsoHtml}
</body>
</html>`;
  fs.writeFileSync(path.join(termsDir, `${slug}.html`), html);
  if (!draft) {
    urls.push(`${baseUrl}/${slug}.html`);
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);
