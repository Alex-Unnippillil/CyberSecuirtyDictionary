(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BM25 = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  function tokenize(text) {
    return text.toLowerCase().match(/\b\w+\b/g) || [];
  }

  function buildIndex(terms) {
    const docs = terms.map(t => tokenize(`${t.term || ''} ${t.definition || ''}`));
    const docFreq = {};
    docs.forEach(tokens => {
      const seen = new Set(tokens);
      seen.forEach(tok => {
        docFreq[tok] = (docFreq[tok] || 0) + 1;
      });
    });
    const avgDocLen = docs.reduce((sum, tokens) => sum + tokens.length, 0) / docs.length;
    return { docs, docFreq, avgDocLen };
  }

  function scoreDocument(docTokens, queryTokens, stats, k1 = 1.5, b = 0.75) {
    const { docFreq, avgDocLen, N } = stats;
    const tf = {};
    docTokens.forEach(t => {
      tf[t] = (tf[t] || 0) + 1;
    });
    let score = 0;
    queryTokens.forEach(q => {
      const df = docFreq[q] || 0;
      if (df === 0) return;
      const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
      const freq = tf[q] || 0;
      const denom = freq + k1 * (1 - b + (b * docTokens.length) / avgDocLen);
      score += idf * ((freq * (k1 + 1)) / denom);
    });
    return score;
  }

  return { tokenize, buildIndex, scoreDocument };
}));
