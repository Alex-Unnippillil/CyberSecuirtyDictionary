#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const patterns = [
  /\bssn\b/i,
  /\bsocial\s+security\s+number\b/i,
  /\bpassport\b/i,
  /\blicense\s*number\b/i,
  /\bphone\b/i,
  /\bemail\b/i,
  /\baddress\b/i
];

const ignoreDirs = new Set(['.git', 'node_modules']);
const ignoreFiles = new Set(['terms.json', path.join('data', 'terms.yaml'), 'pii-scan.js']);
const allowedExt = new Set(['.js', '.json', '.html', '.css', '.yml', '.yaml']);
const reportLines = [];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  for (const re of patterns) {
    const match = content.match(re);
    if (match) {
      reportLines.push(`${filePath}: potential PII term "${match[0]}"`);
    }
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!ignoreDirs.has(entry.name)) {
        walk(fullPath);
      }
    } else {
      const relPath = path.relative('.', fullPath);
      if (!ignoreFiles.has(relPath) && allowedExt.has(path.extname(entry.name))) {
        scanFile(fullPath);
      }
    }
  }
}

walk('.');
const outFile = 'pii-report.txt';
if (reportLines.length === 0) {
  fs.writeFileSync(outFile, 'No PII fields found.\n');
} else {
  fs.writeFileSync(outFile, reportLines.join('\n') + '\n');
  console.error('PII fields detected. See pii-report.txt for details.');
  process.exit(1);
}
