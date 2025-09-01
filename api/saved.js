const http = require('http');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'saved.json');

function readSaved() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (err) {
    return [];
  }
}

function writeSaved(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  if (req.url === '/api/saved' && req.method === 'GET') {
    const items = readSaved();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(items));
  } else if (req.url === '/api/saved' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        if (!data.id) {
          data.id = Date.now().toString();
        }
        const items = readSaved();
        items.push(data);
        writeSaved(items);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      } catch (err) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`API server listening on ${PORT}`);
});
