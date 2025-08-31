const assert = require('assert').strict;
const { sendFeedback } = require('../assets/js/feedback.js');

(async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    status: 403,
    headers: new Headers({ 'X-RateLimit-Remaining': '0' }),
    ok: false,
    text: async () => 'rate limit'
  });
  try {
    await sendFeedback({ page: 'test', comment: '' });
    assert.fail('Expected rate-limit error');
  } catch (err) {
    assert.strictEqual(err.message, 'rate-limit');
    console.log('Rate limit handled gracefully');
  } finally {
    global.fetch = originalFetch;
  }
})();
