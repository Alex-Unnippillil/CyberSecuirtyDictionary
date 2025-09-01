const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = `<!DOCTYPE html><html dir="rtl"><head><link id="canonical-link" rel="canonical" href=""></head><body>
<div id="terms-list"></div>
<div id="definition-container"></div>
<input id="search" />
<button id="random-term"></button>
<nav id="alpha-nav"></nav>
<button id="dark-mode-toggle"></button>
<input type="checkbox" id="show-favorites" />
<button id="scrollToTopBtn"></button>
</body></html>`;

const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'https://example.com' });

dom.window.requestAnimationFrame = (cb) => cb();
dom.window.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ terms: [] }) });

const today = new Date().toDateString();
dom.window.localStorage.setItem(
  'lastRandomTerm',
  JSON.stringify({ date: today, term: { term: 't', definition: 'd' } })
);

const script = fs.readFileSync('script.js', 'utf8');
dom.window.eval(script);

const rootVar = dom.window.document.documentElement.style.getPropertyValue('--dir-multiplier').trim();

if (rootVar === '-1') {
  console.log('RTL transition test passed');
} else {
  console.error(`Expected -1, got ${rootVar}`);
  process.exit(1);
}
