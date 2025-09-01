const { buildIndex, search } = require('./assets/js/search-core.js');
const termsData = require('./terms.json');
const terms = Array.isArray(termsData) ? termsData : termsData.terms;
const index = buildIndex(terms);

const tests = [
  { query: 'phising', expected: 'Phishing' },
  { query: 'aptt', expected: 'Advanced Persistent Threat (APT)' },
  { query: 'soc', expected: 'Security Operations Center (SOC)' },
  { query: 'email scam', expected: 'Phishing' }
];

let passed = 0;
for (const t of tests) {
  const res = search(t.query, index.text, index.phonetic);
  if (res.some(r => r.term === t.expected)) {
    passed++;
  } else {
    console.error(`Failed query "${t.query}"`);
  }
}

const accuracy = passed / tests.length;
console.log(`Search accuracy: ${passed}/${tests.length} (${(accuracy * 100).toFixed(0)}%)`);
if (accuracy < 0.75) {
  console.error('Accuracy below 75%');
  process.exit(1);
}
