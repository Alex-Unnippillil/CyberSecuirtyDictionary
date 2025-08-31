const fs = require('fs');
const path = require('path');

const termsPath = path.join(__dirname, '..', 'terms.json');
const outputPath = path.join(__dirname, '..', 'daily-term.json');

const termsData = JSON.parse(fs.readFileSync(termsPath, 'utf8'));
const today = new Date().toISOString().split('T')[0];

let current;
if (fs.existsSync(outputPath)) {
  try {
    current = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  } catch (err) {
    current = null;
  }
}

if (!current || current.date !== today) {
  const term = termsData.terms[Math.floor(Math.random() * termsData.terms.length)];
  const daily = {
    date: today,
    term: term.term,
    definition: term.definition,
  };
  fs.writeFileSync(outputPath, JSON.stringify(daily, null, 2) + '\n');
}
