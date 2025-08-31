const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '..', 'data', 'terms.yaml'),
  path.join(__dirname, '..', 'terms.json')
];

const fix = process.argv.includes('--fix');
let hasIssue = false;

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (/[\u00AE\u2122]/.test(line)) {
      console.warn(`${path.relative(process.cwd(), file)}:${index + 1} contains trademark symbol`);
      hasIssue = true;
    }
  });
  if (fix) {
    const newContent = content.replace(/[\u00AE\u2122]/g, '');
    if (newContent !== content) {
      fs.writeFileSync(file, newContent);
    }
  }
}

if (hasIssue) {
  process.exitCode = 1;
}
