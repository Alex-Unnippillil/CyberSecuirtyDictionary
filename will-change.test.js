const { JSDOM } = require('jsdom');
const { attachWillChange } = require('./will-change.js');

const dom = new JSDOM('<div id="el1"></div><div id="el2"></div>', {
  pretendToBeVisual: true
});

const { document } = dom.window;

function testTransition() {
  const el = document.getElementById('el1');
  attachWillChange(el, 'transform');

  el.dispatchEvent(new dom.window.Event('transitionstart'));
  if (dom.window.getComputedStyle(el).willChange !== 'transform') {
    console.error('will-change not set on transitionstart');
    process.exit(1);
  }

  el.dispatchEvent(new dom.window.Event('transitionend'));
  if (dom.window.getComputedStyle(el).willChange !== '') {
    console.error('will-change not removed after transitionend');
    process.exit(1);
  }
}

function testAnimation() {
  const el = document.getElementById('el2');
  attachWillChange(el, 'transform');

  el.dispatchEvent(new dom.window.Event('animationstart'));
  if (dom.window.getComputedStyle(el).willChange !== 'transform') {
    console.error('will-change not set on animationstart');
    process.exit(1);
  }

  el.dispatchEvent(new dom.window.Event('animationend'));
  if (dom.window.getComputedStyle(el).willChange !== '') {
    console.error('will-change not removed after animationend');
    process.exit(1);
  }
}

testTransition();
testAnimation();

console.log('Will-change removal tests passed');

