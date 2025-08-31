const headingSentenceCase = require('./scripts/remark-heading-sentence-case.js');

module.exports = {
  plugins: [
    'remark-lint',
    headingSentenceCase,
    ['remark-lint-prohibited-strings', [{ no: 'utilized', yes: 'use' }]],
    'remark-lint-write-good'
  ]
};
