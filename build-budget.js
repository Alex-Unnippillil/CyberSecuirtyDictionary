#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');

// Define bundle size limits in bytes
const limits = {
  'script.js': 15 * 1024, // 15 KB
  'styles.css': 10 * 1024 // 10 KB
};

let exitCode = 0;
const lines = [];

for (const [file, limit] of Object.entries(limits)) {
  const size = fs.statSync(file).size;
  let prevSize = 0;
  try {
    const prev = execSync(`git show HEAD^:${file}`, { encoding: 'utf8' });
    prevSize = Buffer.byteLength(prev);
  } catch {
    prevSize = 0;
  }
  const delta = size - prevSize;
  const pass = size <= limit;
  lines.push(
    `${file}: ${size} bytes (limit ${limit}) delta ${delta >= 0 ? '+' : ''}${delta} -> ${pass ? 'PASS' : 'FAIL'}`
  );
  if (!pass) {
    exitCode = 1;
  }
}

console.log(lines.join('\n'));
process.exit(exitCode);
