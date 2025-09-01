const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'site.config.json');
let siteUrl = '';
try {
  const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  siteUrl = (cfg.siteUrl || '').replace(/\/+$/, '');
} catch (e) {
  siteUrl = '';
}

const pages = ['index.html', 'search.html', 'diagnostics.html'];
const urls = pages.map(p => `${siteUrl}/${p === 'index.html' ? '' : p}`);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);

const robots = `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`;
fs.writeFileSync(path.join(__dirname, 'robots.txt'), robots);

console.log('Generated sitemap.xml and robots.txt');
