const fs = require('fs');

const terms = JSON.parse(fs.readFileSync('terms.json', 'utf8')).terms;
const seen = new Set();
const duplicates = new Set();

for (const { term } of terms) {
  if (seen.has(term)) {
    duplicates.add(term);
  } else {
    seen.add(term);
  }
}

if (duplicates.size > 0) {
  console.error(`Duplicate terms found: ${Array.from(duplicates).join(', ')}`);
  process.exit(1);
}

