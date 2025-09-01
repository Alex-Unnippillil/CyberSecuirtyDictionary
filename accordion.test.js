const { JSDOM } = require('jsdom');
const { setupAccordion } = require('./assets/js/accordion.js');

const html = `
<div id="root">
  <div class="accordion-item">
    <button class="accordion-header" type="button">Definition</button>
    <div class="accordion-panel">One</div>
  </div>
  <div class="accordion-item">
    <button class="accordion-header" type="button">Examples</button>
    <div class="accordion-panel">Two</div>
  </div>
  <div class="accordion-item">
    <button class="accordion-header" type="button">Mitigations</button>
    <div class="accordion-panel">Three</div>
  </div>
  <div class="accordion-item">
    <button class="accordion-header" type="button">Standards</button>
    <div class="accordion-panel">Four</div>
  </div>
</div>
`;

const dom = new JSDOM(html, { pretendToBeVisual: true });
setupAccordion(dom.window.document.getElementById('root'));

const headers = dom.window.document.querySelectorAll('.accordion-header');
headers[0].focus();
const down = new dom.window.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
headers[0].dispatchEvent(down);
if (dom.window.document.activeElement !== headers[1]) {
  console.error('ArrowDown did not move focus to next header');
  process.exit(1);
}

headers[0].focus();
const up = new dom.window.KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
headers[0].dispatchEvent(up);
if (dom.window.document.activeElement !== headers[3]) {
  console.error('ArrowUp did not wrap focus to last header');
  process.exit(1);
}

console.log('Accordion keyboard navigation test passed');
