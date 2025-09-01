const fs = require('fs');
const path = require('path');

const termsDir = path.join(__dirname, 'terms');
if (!fs.existsSync(termsDir)) {
  console.error('Terms directory not found. Did you run build?');
  process.exit(1);
}

const files = fs.readdirSync(termsDir).filter(f => f.endsWith('.html'));
let broken = [];
for (const file of files) {
  const html = fs.readFileSync(path.join(termsDir, file), 'utf8');
  const links = [...html.matchAll(/href="([^"#]+)"/g)].map(m => m[1]);
  for (const href of links) {
    if (/^https?:/.test(href)) continue; // ignore external
    const target = path.join(termsDir, href);
    if (!fs.existsSync(target)) {
      broken.push(`${file} -> ${href}`);
    }
  }
}

if (broken.length) {
  console.error('Broken links detected:');
  for (const b of broken) console.error('  ' + b);
  process.exit(1);
}
console.log('No broken links detected');
