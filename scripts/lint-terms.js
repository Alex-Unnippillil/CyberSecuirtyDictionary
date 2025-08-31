#!/usr/bin/env node
const fs = require('fs');
const yaml = require('js-yaml');

const filePath = 'data/terms.yaml';
const content = fs.readFileSync(filePath, 'utf8');
const data = yaml.load(content);
const lines = content.split(/\r?\n/);
const errors = [];

function findLine(term) {
  const slugLine = lines.findIndex(l => l.includes(`slug: ${term.slug}`));
  if (slugLine !== -1) {
    return slugLine + 1;
  }
  const nameLine = lines.findIndex(l => l.includes(`name: ${term.name}`));
  return nameLine !== -1 ? nameLine + 1 : '?';
}

data.forEach(term => {
  const line = findLine(term);
  if (!term.sources || term.sources.length === 0) {
    errors.push(`${filePath}:${line} missing 'sources'`);
  }
  if (!term.access_date || typeof term.access_date !== 'string' || !/\d{4}-\d{2}-\d{2}/.test(term.access_date)) {
    errors.push(`${filePath}:${line} missing or invalid 'access_date'`);
  }
});

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
