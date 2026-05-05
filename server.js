const http = require('http');
const path = require('path');
const fs = require('fs');

const WEB_ROOT = path.resolve(__dirname);
const ALLOWED_EXTENSIONS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mdx': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

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
    sendError(res, 429, 'Too Many Requests');
    return false;
  }

  bucket.tokens -= 1;
  return true;
}

function sendError(res, statusCode, message) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ error: message }));
}

function resolveRequestedPath(urlPath) {
  const rawPath = String(urlPath || '').split('?')[0].split('#')[0];

  if (!rawPath.startsWith('/')) {
    return { error: 'Invalid path', statusCode: 400 };
  }

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(rawPath);
  } catch {
    return { error: 'Invalid path', statusCode: 400 };
  }

  if (decodedPath.includes('\0')) {
    return { error: 'Invalid path', statusCode: 400 };
  }

  const rawSegments = decodedPath.split('/').filter(Boolean);
  if (rawSegments.includes('..') || decodedPath.startsWith('//')) {
    return { error: 'Invalid path', statusCode: 400 };
  }

  const normalizedPath = path.posix.normalize(decodedPath);
  const relativePath = normalizedPath === '/' ? 'index.html' : normalizedPath.replace(/^\/+/,'');
  const resolvedPath = path.resolve(WEB_ROOT, relativePath);

  if (resolvedPath !== WEB_ROOT && !resolvedPath.startsWith(`${WEB_ROOT}${path.sep}`)) {
    return { error: 'Invalid path', statusCode: 400 };
  }

  const ext = path.extname(resolvedPath).toLowerCase();
  const contentType = ALLOWED_EXTENSIONS[ext];

  if (!contentType) {
    return { error: 'Unsupported file type', statusCode: 403 };
  }

  return { resolvedPath, contentType };
}


function serveStatic(req, res) {
  const pathResult = resolveRequestedPath(req.url);

  if (pathResult.error) {
    sendError(res, pathResult.statusCode, pathResult.error);
    return;
  }

  fs.readFile(pathResult.resolvedPath, (err, data) => {
    if (err) {
      sendError(res, 404, 'Not Found');
      return;
    }

    res.writeHead(200, { 'Content-Type': pathResult.contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (!rateLimit(req, res)) {
    return;
  }
  serveStatic(req, res);
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = {
  ALLOWED_EXTENSIONS,
  WEB_ROOT,
  rateLimit,
  resolveRequestedPath,
  serveStatic,
  server
};
