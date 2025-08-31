#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const scripts = pkg.scripts || {};
const info = pkg['scripts-info'] || {};

console.log('Usage: pnpm run <script>');
console.log('\nAvailable scripts:\n');

for (const name of Object.keys(scripts)) {
  const description = info[name] || '';
  const spacing = description ? ' - ' : '';
  console.log(`${name}${spacing}${description}`);
}
