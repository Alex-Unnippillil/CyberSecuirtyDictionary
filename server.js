const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }
  const filePath = path.join(__dirname, reqPath);
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    const name = path.basename(filePath);
    const hashMatch = name.match(/\.([0-9a-f]{8})\./);
    if (hashMatch) {
      const etag = hashMatch[1];
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('ETag', etag);
      if (req.headers['if-none-match'] === etag) {
        res.statusCode = 304;
        res.end();
        return;
      }
    } else {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    }
    fs.createReadStream(filePath).pipe(res);
  });
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
