const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = `<!DOCTYPE html><html><head><link id="canonical-link" /></head><body>
<ul id="terms-list"></ul>
<div id="definition-container"></div>
<input id="search" />
<button id="random-term"></button>
<nav id="alpha-nav"></nav>
<button id="dark-mode-toggle"></button>
<input type="checkbox" id="show-favorites" />
<button id="scrollToTopBtn"></button>
</body></html>`;

const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'https://example.com' });

dom.window.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ terms: [] }) });

const today = new Date().toDateString();
dom.window.localStorage.setItem(
  'lastRandomTerm',
  JSON.stringify({ date: today, term: { term: 'Example', definition: 'Def' } })
);

const script = fs.readFileSync('script.js', 'utf8');
dom.window.eval(script);

const btn = dom.window.document.createElement('button');
dom.window.addChipInteractions(btn);
let activated = false;
btn.addEventListener('click', () => {
  activated = true;
});

btn.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

if (!activated) {
  console.error('Chip keyboard activation test failed');
  process.exit(1);
}
console.log('Chip keyboard activation test passed');
