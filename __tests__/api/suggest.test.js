const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const request = require('supertest');
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    moduleResolution: 'node',
    esModuleInterop: true,
    resolveJsonModule: true,
  },
});
const { GET } = require('../../api/suggest/route.ts');

function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const fetchRequest = new Request(url, { method: req.method });
    GET(fetchRequest).then((response) => {
      res.statusCode = response.status;
      response.headers.forEach((value, key) => res.setHeader(key, value));
      response.text().then((body) => res.end(body));
    }).catch((err) => {
      res.statusCode = 500;
      res.end(err.message);
    });
  });
}

test('returns prompt suggestions for tags', async (t) => {
  const server = createServer();
  t.after(() => server.close());
  const res = await request(server).get('/api/suggest?tags=explain,security');
  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(res.body.suggestions));
  assert.ok(res.body.suggestions.length > 0);
});
