const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = '<!DOCTYPE html><html><body></body></html>';
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'https://example.com' });

Object.defineProperty(dom.window.navigator, 'maxTouchPoints', { value: 1, configurable: true });

dom.window.matchMedia = () => ({ matches: false, addEventListener() {}, addListener() {} });

const script = fs.readFileSync('assets/js/pull-indicator.js', 'utf8');
dom.window.eval(script);

const indicator = dom.window.document.getElementById('pull-indicator');
if (!indicator) {
  console.error('Pull indicator not initialized');
  process.exit(1);
}
console.log('Pull indicator test passed');
