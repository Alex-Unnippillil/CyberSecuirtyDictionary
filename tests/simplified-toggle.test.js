const { JSDOM } = require('jsdom');
const fs = require('fs');
const vm = require('vm');

const html = `<!DOCTYPE html><body>
<ul id="terms-list"></ul>
<div id="definition-container"></div>
<input id="search" />
<button id="random-term"></button>
<nav id="alpha-nav"></nav>
<button id="dark-mode-toggle"></button>
<input type="checkbox" id="show-favorites" />
<input type="checkbox" id="simplified-toggle" />
<button id="scrollToTopBtn"></button>
</body>`;

const dom = new JSDOM(html, { url: 'https://example.org' });
const { window } = dom;

global.window = window;
window.addEventListener = () => {};

global.document = window.document;
global.localStorage = window.localStorage;

global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ terms: [] }) });

const today = new Date().toDateString();
window.localStorage.setItem(
  'lastRandomTerm',
  JSON.stringify({ date: today, term: { term: 'Dummy', definition: 'Dummy.' } })
);

const scriptContent = fs.readFileSync('./script.js', 'utf8');
vm.runInThisContext(scriptContent);

termsData = { terms: [{ term: 'Example', definition: 'A long definition. Second sentence explains more.' }] };
populateTermsList();
let def = document.querySelector('#terms-list p').textContent;
if (def !== 'A long definition. Second sentence explains more.') {
  throw new Error('Expected full definition');
}

document.getElementById('simplified-toggle').checked = true;
populateTermsList();
def = document.querySelector('#terms-list p').textContent;
if (def !== 'A long definition.') {
  throw new Error('Simplified definition not displayed');
}

console.log('Simplified toggle test passed');
