#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Fuse = require('fuse.js');
const open = require('open');

const indexPath = path.join(__dirname, '..', 'terms.index.json');
const terms = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

const fuse = new Fuse(terms, { keys: ['term', 'definition'], threshold: 0.3 });

const query = process.argv.slice(2).join(' ');

if (!query) {
  console.error('Usage: cli-term <query>');
  process.exit(1);
}

const results = fuse.search(query, { limit: 5 });

if (results.length === 0) {
  console.log('No matching terms found.');
  process.exit(0);
}

results.forEach((res, idx) => {
  console.log(`${idx + 1}. ${res.item.term} - ${res.item.definition}`);
});

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('Open which result? (number or enter to exit) ', answer => {
  rl.close();
  const n = parseInt(answer, 10);
  if (!isNaN(n) && results[n - 1]) {
    open(results[n - 1].item.url);
  }
});
