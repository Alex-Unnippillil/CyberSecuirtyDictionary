const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/api/stream') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    // Simulated retrieval sources streamed before text output
    const sources = [
      { title: 'NIST Glossary', url: 'https://www.nist.gov/itl/applied-cybersecurity/nice/resources/glossary' },
      { title: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Cybersecurity' },
    ];

    sources.forEach((src, idx) => {
      setTimeout(() => {
        res.write(`event: source\ndata: ${JSON.stringify(src)}\n\n`);
      }, idx * 100);
    });

    // Begin text streaming shortly after the first source is sent
    const text = 'Streaming definition content from the model.';
    let i = 0;
    setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          res.write(`event: token\ndata: ${text[i]}\n\n`);
          i++;
        } else {
          clearInterval(interval);
          res.write('event: end\ndata: [DONE]\n\n');
          res.end();
        }
      }, 50);
    }, 20);
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000, () => {
  console.log('Streaming server running on http://localhost:3000');
});
