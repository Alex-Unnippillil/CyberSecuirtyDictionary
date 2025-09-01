const http = require('http');
const fs = require('fs');
const path = require('path');

const termsPath = path.join(__dirname, 'terms.json');
let terms = [];
try {
  const data = JSON.parse(fs.readFileSync(termsPath, 'utf8'));
  terms = Array.isArray(data) ? data : data.terms || [];
} catch (err) {
  console.error('Failed to load terms.json', err);
}

function sanitize(str) {
  return (str || '').toLowerCase().replace(/[^a-z]/g, '');
}

function letterCount(str) {
  return sanitize(str).split('').reduce((acc, ch) => {
    acc[ch] = (acc[ch] || 0) + 1;
    return acc;
  }, {});
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === '/api/anagrams') {
    const word = url.searchParams.get('word') || '';
    if (!word) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing word parameter' }));
      return;
    }
    const lenParam = url.searchParams.get('length');
    const requestedLength = lenParam ? parseInt(lenParam, 10) : null;
    const baseCount = letterCount(word);

    const results = terms
      .map((t) => t.term || t.name || '')
      .filter((term) => {
        const clean = sanitize(term);
        if (requestedLength && clean.length !== requestedLength) return false;
        if (clean === sanitize(word)) return false;
        const count = letterCount(clean);
        return Object.keys(count).every((ch) => count[ch] <= (baseCount[ch] || 0));
      });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ anagrams: results }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
