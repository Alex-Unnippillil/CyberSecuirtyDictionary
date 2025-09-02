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
const handler = require('../../pages/api/search.ts').default;

function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    req.query = Object.fromEntries(url.searchParams.entries());
    res.status = function (code) {
      this.statusCode = code;
      return this;
    };
    res.json = function (data) {
      this.setHeader('Content-Type', 'application/json');
      this.end(JSON.stringify(data));
    };
    handler(req, res);
  });
}

test('returns empty results when query is missing', async (t) => {
  const server = createServer();
  t.after(() => server.close());
  const res = await request(server).get('/api/search');
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(res.body, { results: [], suggestions: [] });
});

test('returns matching results for a query', async (t) => {
  const server = createServer();
  t.after(() => server.close());
  const res = await request(server).get('/api/search?q=phishing');
  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(res.body.results));
  assert.ok(res.body.results.some((r) => r.term === 'Phishing'));
  assert.deepStrictEqual(res.body.suggestions, []);
});
