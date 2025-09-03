const test = require('node:test');
const assert = require('node:assert/strict');

test('expandTopic uses selected provider', async () => {
  const originalFetch = global.fetch;

  global.fetch = async () => ({
    json: async () => ({ choices: [{ message: { content: 'openai' } }] })
  });
  process.env.OPENAI_API_KEY = 'test';
  const mod = require('../lib/ai.ts');
  const openai = await mod.expandTopic('topic', 'openai');
  assert.equal(openai, 'openai');

  global.fetch = async () => ({
    json: async () => ({ content: [{ text: 'anthropic' }] })
  });
  process.env.ANTHROPIC_API_KEY = 'test';
  const anth = await mod.expandTopic('topic', 'anthropic');
  assert.equal(anth, 'anthropic');

  await assert.rejects(() => mod.expandTopic('topic', 'other'));

  delete process.env.OPENAI_API_KEY;
  await assert.rejects(() => mod.expandTopic('topic', 'openai'));

  delete process.env.ANTHROPIC_API_KEY;
  await assert.rejects(() => mod.expandTopic('topic', 'anthropic'));

  global.fetch = originalFetch;
});
