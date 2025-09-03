const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('diagnostics.html', 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'https://example.com' });
const script = fs.readFileSync('assets/js/diagnostics.js', 'utf8');
dom.window.eval(script);

const maxVisible = dom.window.__MAX_HISTORY_VISIBLE__ || 10;
const samples = [];
for (let i = 0; i < maxVisible + 2; i++) {
  samples.push({ timestamp: i, lcp: i, cls: 0.1, tbt: 10 });
}
dom.window.localStorage.setItem('web-vitals', JSON.stringify(samples));

dom.window.renderDiagnostics();

const foldRow = dom.window.document.querySelector('.history-fold');
if (!foldRow) {
  console.error('Fold row not rendered');
  process.exit(1);
}

let hiddenRows = dom.window.document.querySelectorAll('.hidden-history');
if (hiddenRows.length !== 2) {
  console.error(`Expected 2 hidden rows, got ${hiddenRows.length}`);
  process.exit(1);
}

foldRow.querySelector('button').click();

hiddenRows = dom.window.document.querySelectorAll('.hidden-history.revealed');
if (hiddenRows.length !== 2) {
  console.error('Hidden rows not revealed on expand');
  process.exit(1);
}

console.log('Diagnostics render test passed');
