const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer(rootDir) {
  return http.createServer((req, res) => {
    const reqPath = decodeURIComponent(req.url.split('?')[0]);
    const filePath = path.join(rootDir, reqPath);
    const accept = req.headers['accept-encoding'] || '';
    const brPath = filePath + '.br';
    const streamPath = accept.includes('br') && fs.existsSync(brPath) ? brPath : filePath;
    if (streamPath.endsWith('.br')) {
      res.setHeader('Content-Encoding', 'br');
    }
    const stream = fs.createReadStream(streamPath);
    stream.on('error', () => {
      res.statusCode = 404;
      res.end('Not found');
    });
    stream.pipe(res);
  });
}

if (require.main === module) {
  const port = process.env.PORT || 8080;
  const server = createServer(__dirname);
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = { createServer };
