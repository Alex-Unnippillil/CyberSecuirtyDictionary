const fs = require('fs');
const path = require('path');

const clustersPath = path.join(__dirname, '..', 'clusters.json');
const templatePath = path.join(__dirname, '..', 'templates', 'topic.html');
const outputDir = path.join(__dirname, '..', 'topics');

const data = JSON.parse(fs.readFileSync(clustersPath, 'utf8'));
const template = fs.readFileSync(templatePath, 'utf8');

function slugify(term) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const clusters = data.clusters || [];
fs.mkdirSync(outputDir, { recursive: true });

const navLinks = [
  '<a href="../index.html">Home</a>',
  '<a href="../templates/guidelines.html">Definition Guidelines</a>',
  ...clusters.map(c => `<a href="${slugify(c.title)}.html">${escapeHtml(c.title)}</a>`)
].join(' ');

clusters.forEach(cluster => {
  const termsList = cluster.terms
    .map(term => {
      const url = `../index.html#${encodeURIComponent(term)}`;
      return `<li><a href="${url}">${escapeHtml(term)}</a></li>`;
    })
    .join('\n    ');

  const content = template
    .replace(/{{title}}/g, escapeHtml(cluster.title))
    .replace('{{summary}}', escapeHtml(cluster.summary))
    .replace('{{terms}}', termsList)
    .replace('{{nav}}', navLinks);

  const fileName = `${slugify(cluster.title)}.html`;
  fs.writeFileSync(path.join(outputDir, fileName), content);
});
