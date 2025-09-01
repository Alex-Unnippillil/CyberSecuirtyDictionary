const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Paths to data files
const dataDir = path.join(__dirname, '..', 'data');
const topicsPath = path.join(dataDir, 'topics.yaml');
const termsPath = path.join(dataDir, 'terms.yaml');

// Load YAML data from CMS files
const topics = yaml.load(fs.readFileSync(topicsPath, 'utf8'));
const terms = yaml.load(fs.readFileSync(termsPath, 'utf8'));

// Map term slugs to their display names
const termMap = {};
for (const term of terms) {
  termMap[term.slug] = term.name;
}

// Output directory for generated topic pages
const outDir = path.join(__dirname, '..', 'topics');
fs.mkdirSync(outDir, { recursive: true });

// Generate individual topic pages
for (const topic of topics) {
  const wordList = topic.words.map(slug => `<li>${termMap[slug] || slug}</li>`).join('\n    ');
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${topic.name} - Cybersecurity Topics</title>
  <link rel="stylesheet" href="../styles.css">
</head>
<body>
  <main class="container">
    <h1>${topic.name}</h1>
    <p>${topic.description}</p>
    <ul>
    ${wordList}
    </ul>
  </main>
</body>
</html>`;
  fs.writeFileSync(path.join(outDir, `${topic.slug}.html`), html);
}

// Generate an index page listing all topics
const links = topics
  .map(t => `<li><a href="${t.slug}.html">${t.name}</a></li>`)
  .join('\n    ');
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Topics - Cybersecurity Dictionary</title>
  <link rel="stylesheet" href="../styles.css">
</head>
<body>
  <main class="container">
    <h1>Topics</h1>
    <ul>
    ${links}
    </ul>
  </main>
</body>
</html>`;
fs.writeFileSync(path.join(outDir, 'index.html'), indexHtml);
