const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const dataPath = path.join(__dirname, '..', 'data', 'terms.yaml');
const fileContent = fs.readFileSync(dataPath, 'utf8');
const terms = yaml.load(fileContent);

// Map term names to starting line numbers for edit links
const lines = fileContent.split(/\r?\n/);
const lineMap = {};
let lineNumber = 0;
for (const line of lines) {
  lineNumber += 1;
  if (line.startsWith('- name:')) {
    const name = line.replace('- name:', '').trim();
    lineMap[name] = lineNumber;
  }
}

const now = new Date();
const oneYearMs = 365 * 24 * 60 * 60 * 1000;
const outdated = [];

for (const term of terms) {
  if (!term.last_reviewed) continue;
  const reviewed = new Date(term.last_reviewed);
  if (now - reviewed > oneYearMs) {
    outdated.push({
      name: term.name,
      category: term.category,
      lastReviewed: term.last_reviewed,
      line: lineMap[term.name] || 1,
    });
  }
}

const domains = Array.from(new Set(outdated.map(t => t.category))).sort();

const dashboardHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Outdated Terms Dashboard</title>
</head>
<body>
  <h1>Outdated Terms</h1>
  <label for="domain-filter">Filter by domain:</label>
  <select id="domain-filter">
    <option value="all">All</option>
    ${domains.map(d => `<option value="${d}">${d}</option>`).join('')}
  </select>
  <ul id="terms">
    ${outdated.map(t => {
      const editUrl = `https://github.com/Alex-Unnippillil/CyberSecuirtyDictionary/edit/main/data/terms.yaml#L${t.line}`;
      return `<li data-domain="${t.category}"><a href="${editUrl}">${t.name}</a> - ${t.category} (last reviewed ${t.lastReviewed})</li>`;
    }).join('\n    ')}
  </ul>
  <script>
    const filter = document.getElementById('domain-filter');
    filter.addEventListener('change', () => {
      const domain = filter.value;
      document.querySelectorAll('#terms li').forEach(li => {
        li.style.display = domain === 'all' || li.dataset.domain === domain ? '' : 'none';
      });
    });
  </script>
</body>
</html>\n`;

fs.writeFileSync(path.join(__dirname, '..', 'dashboard.html'), dashboardHtml);
