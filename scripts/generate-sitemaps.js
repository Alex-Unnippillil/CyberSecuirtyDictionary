const fs = require('fs');
const path = require('path');

const terms = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'terms.json'), 'utf8')).terms;
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'site.config.json'), 'utf8'));

const siteUrl = config.siteUrl.replace(/\/+$/, '');
const locales = ['en', 'es', 'fr'];

function slugify(term) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildSitemap(locale) {
  const localeDir = `${siteUrl}/${locale}`;
  const urls = terms.map((t) => {
    const slug = slugify(t.term);
    const loc = `${localeDir}/terms/${slug}.html`;
    const alternates = locales
      .map(
        (alt) =>
          `    <xhtml:link rel="alternate" hreflang="${alt}" href="${siteUrl}/${alt}/terms/${slug}.html" />`
      )
      .join('\n');
    return `  <url>\n    <loc>${loc}</loc>\n${alternates}\n  </url>`;
  });

  const content = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>`;
  fs.writeFileSync(path.join(__dirname, '..', `sitemap-${locale}.xml`), content);
  console.log(`Generated sitemap-${locale}.xml with ${urls.length} entries`);
}

locales.forEach(buildSitemap);
