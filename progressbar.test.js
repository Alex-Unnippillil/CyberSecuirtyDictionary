const fs = require('fs');
const { JSDOM } = require('jsdom');

(async () => {
  const html = '<!DOCTYPE html><html><body></body></html>';
  const dom = new JSDOM(html, { runScripts: 'dangerously' });
  const progressScript = fs.readFileSync('assets/js/progress.js', 'utf8');
  dom.window.eval(progressScript);
  const bar = dom.window.document.getElementById('progress-bar');
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // quick navigation should remain hidden
  dom.window.navigationProgress.start();
  dom.window.navigationProgress.done();
  await wait(150);
  if (dom.window.getComputedStyle(bar).opacity !== '0') {
    console.error('Progress bar should stay hidden for quick navigation');
    process.exit(1);
  }

  // long navigation should reveal and hide
  dom.window.navigationProgress.start();
  await wait(150);
  if (dom.window.getComputedStyle(bar).opacity !== '1') {
    console.error('Progress bar should be visible for long navigation');
    process.exit(1);
  }
  dom.window.navigationProgress.done();
  await wait(350);
  if (dom.window.getComputedStyle(bar).opacity !== '0') {
    console.error('Progress bar should hide after completion');
    process.exit(1);
  }

  // rapid navigation sequences
  dom.window.navigationProgress.start();
  await wait(120);
  dom.window.navigationProgress.start();
  dom.window.navigationProgress.done();
  await wait(50);
  dom.window.navigationProgress.done();
  await wait(350);
  if (dom.window.getComputedStyle(bar).opacity !== '0') {
    console.error('Progress bar should hide after rapid navigation');
    process.exit(1);
  }

  console.log('Progress bar tests passed');
})();
