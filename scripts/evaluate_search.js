const fs = require('fs');
const path = require('path');
const BM25 = require('../assets/js/bm25.js');

const termsPath = path.join(__dirname, '..', 'terms.json');
const testsPath = path.join(__dirname, '..', 'tests', 'search_test.json');
const terms = JSON.parse(fs.readFileSync(termsPath, 'utf8')).terms;
const tests = JSON.parse(fs.readFileSync(testsPath, 'utf8'));

function simpleScore(term, query){
  let s = 0;
  const name = (term.term || '').toLowerCase();
  const def = (term.definition || '').toLowerCase();
  if(name.includes(query)) s += 3;
  if(def.includes(query)) s += 1;
  return s;
}

function precisionAtK(results, relevant, k){
  const top = results.slice(0,k);
  const rel = top.filter(r => relevant.includes(r.term)).length;
  return rel / k;
}

const built = BM25.buildIndex(terms);
const stats = { docFreq: built.docFreq, avgDocLen: built.avgDocLen, N: terms.length };

let baselineTotal = 0;
let bm25Total = 0;

for (const test of tests){
  const query = test.query.toLowerCase();
  const k = test.relevant.length;
  const baseline = terms.map(t => ({ term: t.term, score: simpleScore(t, query) }))
    .filter(r => r.score > 0)
    .sort((a,b)=>b.score - a.score);

  const queryTokens = BM25.tokenize(query);
  const bm25 = terms.map(t => {
    const tokens = BM25.tokenize(`${t.term} ${t.definition}`);
    return { term: t.term, score: BM25.scoreDocument(tokens, queryTokens, stats) };
  }).filter(r => r.score > 0)
    .sort((a,b)=>b.score - a.score);

  const baselinePrecision = precisionAtK(baseline, test.relevant, k);
  const bm25Precision = precisionAtK(bm25, test.relevant, k);
  baselineTotal += baselinePrecision;
  bm25Total += bm25Precision;
  console.log(`Query: ${test.query}`);
  console.log(`Baseline precision: ${baselinePrecision.toFixed(2)}`);
  console.log(`BM25 precision: ${bm25Precision.toFixed(2)}`);
  console.log('---');
}

console.log(`Average baseline precision: ${(baselineTotal/tests.length).toFixed(2)}`);
console.log(`Average BM25 precision: ${(bm25Total/tests.length).toFixed(2)}`);
