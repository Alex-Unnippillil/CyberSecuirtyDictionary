import http from 'http';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';

function createStreamableValue(initial) {
  let controller;
  const stream = new ReadableStream({
    start(c) {
      controller = c;
      if (initial !== undefined) c.enqueue(initial);
    }
  });
  return {
    value: stream,
    update(v) {
      controller.enqueue(v);
    },
    done(v) {
      if (v !== undefined) controller.enqueue(v);
      controller.close();
    }
  };
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/api/progress') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const stream = createStreamableValue();

    (async () => {
      const steps = ['Starting task', 'Halfway there', 'Almost done'];
      for (const step of steps) {
        stream.update(step);
        await new Promise((r) => setTimeout(r, 1000));
      }
      stream.done('Task complete');
    })();

    for await (const chunk of stream.value) {
      res.write(`data: ${chunk}\n\n`);
    }
    res.end();
    return;
  }

  let filePath = req.url === '/' ? 'index.html' : req.url.slice(1);
  try {
    const ext = extname(filePath);
    let contentType = 'text/html';
    if (ext === '.js') contentType = 'application/javascript';
    else if (ext === '.css') contentType = 'text/css';
    const data = await readFile(join(process.cwd(), filePath));
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  } catch (err) {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});

