const fs = require('fs');
const path = require('path');

const termsPath = path.join(__dirname, '..', 'terms.json');
const allowlistPath = path.join(__dirname, 'bias-allowlist.json');

const bannedPhrases = [
  'catastrophic',
  'doomsday',
  'panic',
  'world-ending',
  'terrifying',
  'horrifying',
  'massive loss',
  'critical failure',
  'fatal',
  'evil',
  'cyber apocalypse',
  'fearmongering',
  'fear-mongering'
];

const allowlist = JSON.parse(fs.readFileSync(allowlistPath, 'utf8')).map(p => p.toLowerCase());
const terms = JSON.parse(fs.readFileSync(termsPath, 'utf8')).terms;

const findings = [];

for (const { term, definition } of terms) {
  const lowerDef = definition.toLowerCase();
  for (const phrase of bannedPhrases) {
    const lowerPhrase = phrase.toLowerCase();
    if (lowerDef.includes(lowerPhrase) && !allowlist.includes(lowerPhrase)) {
      findings.push({ term, phrase });
    }
  }
}

fs.writeFileSync('bias_report.json', JSON.stringify(findings, null, 2));

if (findings.length > 0) {
  console.error('Biased or fear-inducing phrases found in definitions:');
  for (const f of findings) {
    console.error(`- ${f.term}: "${f.phrase}"`);
  }
  process.exit(1);
} else {
  console.log('No biased or fear-inducing phrases found.');
}
