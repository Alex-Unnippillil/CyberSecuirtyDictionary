#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error('Usage: node scripts/quarantine.js <paths...>');
  process.exit(1);
}

const repoRoot = path.resolve(__dirname, '..');
const archiveRoot = path.join(repoRoot, 'archive');
if (!fs.existsSync(archiveRoot)) {
  fs.mkdirSync(archiveRoot);
}

for (const target of targets) {
  const absTarget = path.resolve(repoRoot, target);
  if (!fs.existsSync(absTarget)) {
    console.warn(`Skipping missing path: ${target}`);
    continue;
  }
  const rel = path.relative(path.join(repoRoot, 'src', 'features'), absTarget);
  const dest = path.join(archiveRoot, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.renameSync(absTarget, dest);
  console.log(`Quarantined ${target} -> ${path.relative(repoRoot, dest)}`);
}
