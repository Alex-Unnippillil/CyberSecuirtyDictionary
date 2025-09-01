const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const zlib = require('zlib');
const { createServer } = require('./server');
const { precompressDir } = require('./precompress');

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'csd-'));
  const svgContent = '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
  const svgPath = path.join(tmp, 'test.svg');
  fs.writeFileSync(svgPath, svgContent);
  precompressDir(tmp);

  const server = createServer(tmp);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;

  function request(headers) {
    return new Promise((resolve, reject) => {
      const req = http.get({ port, path: '/test.svg', headers }, res => {
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve({ res, body: Buffer.concat(chunks) }));
      });
      req.on('error', reject);
    });
  }

  try {
    const brResp = await request({ 'Accept-Encoding': 'br' });
    if (brResp.res.headers['content-encoding'] !== 'br') {
      throw new Error('Expected br encoding');
    }
    const decoded = zlib.brotliDecompressSync(brResp.body).toString();
    if (decoded !== svgContent) {
      throw new Error('Decoded content mismatch');
    }

    const plainResp = await request({});
    if (plainResp.res.headers['content-encoding']) {
      throw new Error('Unexpected encoding for plain request');
    }
    if (plainResp.body.toString() !== svgContent) {
      throw new Error('Plain content mismatch');
    }
    console.log('Brotli compression test passed');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  } finally {
    server.close();
  }
})();
