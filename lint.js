const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const readability = require('text-readability').default;

const termsPath = path.join(__dirname, 'data', 'terms.yaml');
const terms = yaml.load(fs.readFileSync(termsPath, 'utf8'));

const nameSet = new Set(terms.map(t => t.name));
let errors = [];

for (const term of terms) {
  const { name, definition, sources = [], see_also = [] } = term;
  if (/```|<code>/i.test(definition)) {
    errors.push(`${name}: contains code block`);
  }
  const grade = readability.fleschKincaidGrade(definition);
  const MAX_GRADE = 22;
  if (grade > MAX_GRADE) {
    errors.push(`${name}: reading level too high (${grade.toFixed(1)})`);
  }
  if (!sources.length) {
    errors.push(`${name}: missing sources`);
  }
  for (const ref of see_also) {
    if (!nameSet.has(ref)) {
      errors.push(`${name}: missing reference '${ref}'`);
    }
  }
}

if (errors.length) {
  console.error('Lint errors:');
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log('Content lint passed');
