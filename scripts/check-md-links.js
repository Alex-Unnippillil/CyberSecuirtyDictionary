#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

if (process.env.ALLOWLIST_BYPASS === 'true') {
  console.log('Domain allowlist check bypassed via ALLOWLIST_BYPASS');
  process.exit(0);
}

const allowlistPath = path.join(__dirname, '..', 'allowed-domains.txt');
let allowlist;
try {
  allowlist = fs
    .readFileSync(allowlistPath, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));
} catch (err) {
  console.error(`Failed to read allowlist at ${allowlistPath}:`, err.message);
  process.exit(1);
}

function getMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (['node_modules', '.git'].includes(entry.name)) continue;
      files.push(...getMarkdownFiles(path.join(dir, entry.name)));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

const urlRegex = /https?:\/\/[^\s)]+/g;
const mdFiles = getMarkdownFiles(path.join(__dirname, '..'));
const violations = new Map();

for (const file of mdFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(urlRegex) || [];
  for (const url of matches) {
    try {
      const hostname = new URL(url).hostname;
      if (!allowlist.includes(hostname)) {
        if (!violations.has(file)) violations.set(file, new Set());
        violations.get(file).add(hostname);
      }
    } catch (err) {
      console.warn(`Skipping invalid URL in ${file}: ${url}`);
    }
  }
}

if (violations.size > 0) {
  console.error('Found non-allowlisted domains in Markdown files:');
  for (const [file, hosts] of violations) {
    console.error(`  ${file}: ${Array.from(hosts).join(', ')}`);
  }
  process.exit(1);
}

console.log('All Markdown links use allowlisted domains.');
