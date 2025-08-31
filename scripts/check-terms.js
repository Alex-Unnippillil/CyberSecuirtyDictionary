const fs = require('fs');
const path = require('path');

const file = path.posix.join('data', 'terms.yaml');
const content = fs.readFileSync(file, 'utf8');
const lines = content.split(/\r?\n/);

const allTerms = new Map(); // value -> { line, type, term }
const conflicts = [];
const seeAlsos = [];

let currentTerm = null;
let section = null;

function addTerm(value, line, type, term) {
  const key = value.toLowerCase();
  if (allTerms.has(key)) {
    const prev = allTerms.get(key);
    if (prev.term !== term) {
      conflicts.push({
        file,
        line,
        message: `"${value}" (${type} of "${term}") conflicts with ${prev.type} of "${prev.term}" at line ${prev.line}`
      });
    }
  } else {
    allTerms.set(key, { line, type, term });
  }
}

for (let i = 0; i < lines.length; i++) {
  const lineNum = i + 1;
  const line = lines[i];
  const nameMatch = line.match(/^- name:\s*(.+)\s*$/);
  if (nameMatch) {
    const name = nameMatch[1].trim();
    currentTerm = { name };
    addTerm(name, lineNum, 'name', name);
    section = null;
    continue;
  }
  if (!currentTerm) continue;
  const slugMatch = line.match(/^\s+slug:\s*(.+)\s*$/);
  if (slugMatch) {
    const slug = slugMatch[1].trim();
    currentTerm.slug = slug;
    addTerm(slug, lineNum, 'slug', currentTerm.name);
    section = null;
    continue;
  }
  if (line.match(/^\s+synonyms:\s*$/)) {
    section = 'synonyms';
    continue;
  }
  if (line.match(/^\s+see_also:\s*$/)) {
    section = 'see_also';
    continue;
  }
  if (line.match(/^\s+[a-z_]+:/)) {
    section = null;
    continue;
  }
  const listMatch = line.match(/^\s+-\s*(.+)\s*$/);
  if (listMatch && section === 'synonyms') {
    const val = listMatch[1].trim();
    addTerm(val, lineNum, 'synonym', currentTerm.name);
    continue;
  }
  if (listMatch && section === 'see_also') {
    const val = listMatch[1].trim();
    seeAlsos.push({ value: val, line: lineNum });
    continue;
  }
}

for (const ref of seeAlsos) {
  const key = ref.value.toLowerCase();
  if (!allTerms.has(key)) {
    conflicts.push({
      file,
      line: ref.line,
      message: `Unknown see_also reference "${ref.value}"`
    });
  }
}

const summaryPath = process.env.GITHUB_STEP_SUMMARY;
if (conflicts.length > 0) {
  if (summaryPath) {
    const server = process.env.GITHUB_SERVER_URL || 'https://github.com';
    const repo = process.env.GITHUB_REPOSITORY || '';
    const sha = process.env.GITHUB_SHA || 'main';
    const lines = ['## Definition conflicts', '', '|Issue|Location|', '|---|---|'];
    for (const c of conflicts) {
      const link = `${server}/${repo}/blob/${sha}/${c.file}#L${c.line}`;
      lines.push(`|${c.message}|[${c.file}:${c.line}](${link})|`);
    }
    fs.appendFileSync(summaryPath, lines.join('\n') + '\n');
  }
  for (const c of conflicts) {
    console.log(`::error file=${c.file},line=${c.line},col=1::${c.message}`);
  }
  process.exit(1);
} else {
  if (summaryPath) {
    fs.appendFileSync(summaryPath, 'No definition conflicts detected.\n');
  }
  console.log('No definition conflicts detected.');
}
