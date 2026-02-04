const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.SITE_URL || 'https://alex-unnippillil.github.io/CyberSecuirtyDictionary';

function getHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getHtmlFiles(res));
    } else if (entry.isFile() && res.endsWith('.html')) {
      files.push(res);
    }
  }
  return files;
}

const htmlFiles = getHtmlFiles('.');
const urls = htmlFiles.map((file) => {
  let urlPath = path.relative('.', file).replace(/\\/g, '/');
  if (urlPath === 'index.html') {
    urlPath = '';
  }
  return `${SITE_URL}/${urlPath}`.replace(/\/$/, '/');
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((u) => `  <url>\n    <loc>${u}</loc>\n  </url>`)
  .join('\n')}\n</urlset>\n`;

fs.writeFileSync('sitemap.xml', sitemap);

const robots = `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`;
fs.writeFileSync('robots.txt', robots);
