const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('diagnostics.html', 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'https://example.com' });
const script = fs.readFileSync('assets/js/diagnostics.js', 'utf8');
dom.window.eval(script);

dom.window.localStorage.setItem(
  'web-vitals',
  JSON.stringify([
    { timestamp: 1, lcp: 1.1, cls: 0.1, tbt: 10, tti: 30 },
    { timestamp: 2, lcp: 2.2, cls: 0.2, tbt: 20, tti: 40 }
  ])
);

dom.window.renderDiagnostics();

const rows = dom.window.document.querySelectorAll('#metrics-body tr');
if (rows.length !== 2) {
  console.error(`Expected 2 rows, got ${rows.length}`);
  process.exit(1);
}
const cells = rows[0].querySelectorAll('td');
if (cells.length !== 5) {
  console.error(`Expected 5 columns, got ${cells.length}`);
  process.exit(1);
}
console.log('Diagnostics render test passed');
