const fs = require('fs');
const { JSDOM } = require('jsdom');

function runTest() {
  const html = fs.readFileSync('layout.html', 'utf8');
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const expected = 'https://github.com/Alex-Unnippillil/CyberSecuirtyDictionary/assets/24538548/c5a54c56-babb-485d-b01c-4fdfb186325b';
  const ogImg = doc.querySelector('meta[property="og:image"]');
  const twImg = doc.querySelector('meta[name="twitter:image"]');
  if (!ogImg || ogImg.content !== expected || !twImg || twImg.content !== expected) {
    throw new Error('Branded image not referenced in OG/Twitter tags');
  }
  console.log('OG image metadata test passed');
}

runTest();
