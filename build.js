const fs = require('fs');
const path = require('path');

// Terms are stored in terms.json which mirrors the YAML source.
const dataPath = path.join(__dirname, 'terms.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const termsDir = path.join(__dirname, 'terms');
fs.mkdirSync(termsDir, { recursive: true });

const siteRoot = 'https://alex-unnippillil.github.io/CyberSecuirtyDictionary';
const baseUrl = `${siteRoot}/terms`;

// Collect URLs for sitemap generation, excluding drafts.
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

// Generate paginated sitemaps. Each sitemap file can contain up to
// SITEMAP_SIZE URLs. If multiple files are created, sitemap.xml becomes a
// sitemap index referencing the paginated sitemaps.
const SITEMAP_SIZE = 45000;

function createSitemap(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(u => `  <url><loc>${u}</loc></url>`)
    .join('\n')}\n</urlset>`;
}

if (urls.length <= SITEMAP_SIZE) {
  fs.writeFileSync(
    path.join(__dirname, 'sitemap.xml'),
    createSitemap(urls),
  );
} else {
  const indexEntries = [];
  for (let i = 0; i < urls.length; i += SITEMAP_SIZE) {
    const chunk = urls.slice(i, i + SITEMAP_SIZE);
    const filename = `sitemap-${Math.floor(i / SITEMAP_SIZE) + 1}.xml`;
    fs.writeFileSync(path.join(__dirname, filename), createSitemap(chunk));
    indexEntries.push(`  <sitemap><loc>${siteRoot}/${filename}</loc></sitemap>`);
  }
  const index = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexEntries.join(
    '\n',
  )}\n</sitemapindex>`;
  fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), index);
}
