const fs = require('fs');
const data = JSON.parse(fs.readFileSync('terms.json', 'utf8'));
const techniquePattern = /^T\d{4}$/;
let invalid = 0;
(data.terms || []).forEach(term => {
  if (Array.isArray(term.techniques)) {
    term.techniques.forEach(t => {
      if (!techniquePattern.test(t.id)) {
        console.error(`Invalid technique id for term ${term.term}: ${t.id}`);
        invalid++;
      }
    });
  }
});
if (invalid > 0) {
  console.error(`Found ${invalid} invalid technique mappings.`);
  process.exit(1);
}
console.log('Technique mapping validated for', data.terms.filter(t => t.techniques).length, 'terms');
