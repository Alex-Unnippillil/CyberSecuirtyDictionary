const test = require('node:test');
const assert = require('node:assert/strict');
const { chipsForTags } = require('../lib/prompts.ts');
const { promptTemplates } = require('../lib/ai/prompt-templates.ts');

test('chipsForTags merges and deduplicates prompts', () => {
  const chips = chipsForTags(['explain', 'analogy', 'explain']);
  assert.equal(chips.length, 3);
  const labels = chips.map(c => c.label);
  assert.ok(labels.includes('Explain simply'));
  assert.ok(labels.includes('Why it matters'));
  assert.ok(labels.includes('Give an analogy'));
});

test('promptTemplates provides default templates', () => {
  assert.ok(promptTemplates.length > 0);
});
