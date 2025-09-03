import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory token buckets keyed by IP
const buckets = new Map();
const MAX_TOKENS = 100; // max requests per interval
const INTERVAL_MS = 60 * 1000; // refill interval

function rateLimit(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  let bucket = buckets.get(ip);

  if (!bucket) {
    bucket = { tokens: MAX_TOKENS, last: now };
    buckets.set(ip, bucket);
  } else {
    const elapsed = now - bucket.last;
    const refill = (elapsed / INTERVAL_MS) * MAX_TOKENS;
    bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + refill);
    bucket.last = now;
  }

  if (bucket.tokens < 1) {
    console.log(`Rate limit exceeded for IP ${ip}`);
    res.writeHead(429, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Too Many Requests' }));
    return false;
  }

  bucket.tokens -= 1;
  return true;
}

function serveStatic(req, res) {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
    } else {
      res.writeHead(200);
      res.end(data);
    }
  });
}

const server = http.createServer((req, res) => {
  if (!rateLimit(req, res)) {
    return;
  }
  serveStatic(req, res);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
