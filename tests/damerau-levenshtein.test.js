const assert = require('assert');
const distance = require('../assets/js/damerau.js');

function run() {
  // substitution
  assert.strictEqual(distance('encryption', 'encraption'), 1, 'substitution should be distance 1');
  // insertion
  assert.strictEqual(distance('firewall', 'firewalla'), 1, 'insertion should be distance 1');
  // deletion
  assert.strictEqual(distance('phishing', 'phising'), 1, 'deletion should be distance 1');
  // transposition
  assert.strictEqual(distance('cipher', 'cihper'), 1, 'transposition should be distance 1');
  // two edits
  assert.strictEqual(distance('firewall', 'firwalll'), 2, 'two edits should be distance 2');
  console.log('All Damerau–Levenshtein tests passed');
}

run();
