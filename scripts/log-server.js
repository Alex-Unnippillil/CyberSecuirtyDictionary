const http = require('http');
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
const logFile = path.join(logDir, 'search.log');
fs.mkdirSync(logDir, { recursive: true });

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/log') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const entry = JSON.parse(body);
        entry.timestamp = new Date().toISOString();
        fs.appendFile(logFile, JSON.stringify(entry) + '\n', err => {
          if (err) console.error('Failed to write log', err);
        });
      } catch (e) {
        // ignore malformed entries
      }
      res.writeHead(204);
      res.end();
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Log server listening on ${port}`);
});
