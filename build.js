const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const root = __dirname;
const dist = path.join(root, 'dist');

function slugify(str){
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'');
}

function loadYaml(file){
  const p = path.join(root, file);
  return yaml.load(fs.readFileSync(p, 'utf8'));
}

const config = loadYaml('config.yml');
const termsData = loadYaml('terms.yml');
const terms = termsData.map(t => ({...t, slug: slugify(t.term)}));

// group by categories
const categories = {};
terms.forEach(t => {
  if(!categories[t.category]) categories[t.category] = [];
  categories[t.category].push(t);
});

// clean dist
fs.rmSync(dist, {recursive:true, force:true});
fs.mkdirSync(dist, {recursive:true});
fs.mkdirSync(path.join(dist, 'terms'), {recursive:true});
fs.mkdirSync(path.join(dist, 'categories'), {recursive:true});
fs.mkdirSync(path.join(dist, 'search'), {recursive:true});
fs.mkdirSync(path.join(dist, 'about'), {recursive:true});

// copy assets
['styles.css','script.js'].forEach(file => {
  const src = path.join(root, file);
  if(fs.existsSync(src)){
    fs.copyFileSync(src, path.join(dist, file));
  }
});

// basic html template
function pageTemplate(title, body){
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><link rel="stylesheet" href="/styles.css"></head><body><h1>${title}</h1>${body}</body></html>`;
}

// home page listing terms
const homeBody = `<ul>` + terms.map(t=>`<li><a href="/terms/${t.slug}.html">${t.term}</a> - ${t.definition}</li>`).join('\n') + `</ul>`;
fs.writeFileSync(path.join(dist, 'index.html'), pageTemplate(config.title, homeBody));

// term pages
terms.forEach(t=>{
  const body = `<p>${t.definition}</p><p>Category: <a href="/categories/${slugify(t.category)}.html">${t.category}</a></p>`;
  fs.writeFileSync(path.join(dist, 'terms', `${t.slug}.html`), pageTemplate(t.term, body));
});

// categories index page
const catList = `<ul>` + Object.keys(categories).map(c => `<li><a href="/categories/${slugify(c)}.html">${c}</a> (${categories[c].length})</li>`).join('\n') + `</ul>`;
fs.writeFileSync(path.join(dist, 'categories', 'index.html'), pageTemplate('Categories', catList));

// category pages
Object.keys(categories).forEach(c => {
  const body = `<ul>` + categories[c].map(t => `<li><a href="/terms/${t.slug}.html">${t.term}</a></li>`).join('\n') + `</ul>`;
  fs.writeFileSync(path.join(dist, 'categories', `${slugify(c)}.html`), pageTemplate(c, body));
});

// search page
const searchBody = '<p>Search coming soon.</p>';
fs.writeFileSync(path.join(dist, 'search', 'index.html'), pageTemplate('Search', searchBody));

// about page
const aboutBody = `<p>${config.description}</p><p>Author: ${config.author}</p>`;
fs.writeFileSync(path.join(dist, 'about', 'index.html'), pageTemplate('About', aboutBody));

// 404 page
const notFoundBody = '<p>Page not found.</p>';
fs.writeFileSync(path.join(dist, '404.html'), pageTemplate('404', notFoundBody));

// robots.txt
fs.writeFileSync(path.join(dist, 'robots.txt'), 'User-agent: *\nAllow: /');

// sitemap.xml
const urls = [`${config.baseUrl}/`, ...terms.map(t => `${config.baseUrl}/terms/${t.slug}.html`), `${config.baseUrl}/categories/`, ...Object.keys(categories).map(c => `${config.baseUrl}/categories/${slugify(c)}.html`), `${config.baseUrl}/search/`, `${config.baseUrl}/about/`];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` + urls.map(u => `<url><loc>${u}</loc></url>`).join('') + `</urlset>`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);

// manifest.json
const manifest = { name: config.title, short_name: config.title, start_url: '/', display: 'standalone', icons: [] };
fs.writeFileSync(path.join(dist, 'manifest.json'), JSON.stringify(manifest, null, 2));

// service worker
const sw = `self.addEventListener('install', () => self.skipWaiting());\nself.addEventListener('activate', e => e.waitUntil(clients.claim()));`;
fs.writeFileSync(path.join(dist, 'service-worker.js'), sw);

// terms.json
fs.writeFileSync(path.join(dist, 'terms.json'), JSON.stringify(terms, null, 2));

console.log('Build complete');
