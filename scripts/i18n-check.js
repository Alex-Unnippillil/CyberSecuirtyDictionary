#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'locales');
const files = fs.readdirSync(localesDir).filter((f) => f.endsWith('.json'));
if (files.length === 0) {
  console.error('No locale files found');
  process.exit(1);
}

const baseName = files[0];
const base = JSON.parse(fs.readFileSync(path.join(localesDir, baseName), 'utf8'));
const baseKeys = Object.keys(base).sort();
let missing = false;

for (const file of files.slice(1)) {
  const data = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'));
  const keys = Object.keys(data);
  const missingKeys = baseKeys.filter((k) => !keys.includes(k));
  if (missingKeys.length > 0) {
    console.error(`Locale ${file} missing keys: ${missingKeys.join(', ')}`);
    missing = true;
  }
}

if (missing) {
  process.exit(1);
}
