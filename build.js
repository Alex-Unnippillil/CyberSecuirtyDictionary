const fs = require('fs');
const path = require('path');

// Load term data
const dataPath = path.join(__dirname, 'terms.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Paths and constants
const termsDir = path.join(__dirname, 'terms');
fs.mkdirSync(termsDir, { recursive: true });

const siteUrl = 'https://alex-unnippillil.github.io/CyberSecuirtyDictionary';
const termBaseUrl = `${siteUrl}/terms`;

const urls = [];
const termFeedItems = [];

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
    const link = `${termBaseUrl}/${slug}.html`;
    urls.push(link);
    termFeedItems.push({
      title: term.term,
      description: term.definition,
      link,
    });
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);

// Generate RSS feed for latest terms
function generateRSS(title, items) {
  const itemsXml = items.map(i => `  <item>\n    <title><![CDATA[${i.title}]]></title>\n    <description><![CDATA[${i.description}]]></description>\n    <link>${i.link}</link>\n  </item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n  <title>${title}</title>\n  <link>${siteUrl}</link>\n  <description>${title}</description>\n${itemsXml}\n</channel>\n</rss>`;
}

const termsRSS = generateRSS('Latest Terms', termFeedItems);
fs.writeFileSync(path.join(__dirname, 'terms.xml'), termsRSS);

// Generate RSS feed from CHANGELOG.md if present
const changelogPath = path.join(__dirname, 'CHANGELOG.md');
if (fs.existsSync(changelogPath)) {
  const changelog = fs.readFileSync(changelogPath, 'utf8');
  const sections = changelog.split(/^##\s+/m).slice(1);
  const changelogItems = sections.map(section => {
    const lines = section.trim().split('\n');
    const heading = lines.shift().trim();
    const description = lines.join('\n').trim();
    const link = `${siteUrl}/CHANGELOG.md#${slugify(heading)}`;
    return { title: heading, description, link };
  });
  const changelogRSS = generateRSS('Changelog', changelogItems);
  fs.writeFileSync(path.join(__dirname, 'changelog.xml'), changelogRSS);
}
