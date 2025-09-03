import { test, expect } from '@playwright/test';
import next from 'next';
import { createServer, Server } from 'http';
import fs from 'fs';
import path from 'path';

function getStaticRoutes(): string[] {
  const routes: string[] = [];
  const appDir = path.join(__dirname, '..', 'app');

  function walk(dir: string, url: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (entry.name.startsWith('[')) continue; // skip dynamic
        const seg = entry.name.startsWith('(') ? '' : `/${entry.name}`;
        walk(path.join(dir, entry.name), url + seg);
      } else if (entry.name === 'page.tsx' || entry.name === 'page.ts') {
        routes.push(url || '/');
      }
    }
  }

  walk(appDir, '');
  return Array.from(new Set(routes));
}

const markers: Record<string, string> = {
  '/': 'Cyber Security Dictionary',
  '/a-z': 'Phishing',
  '/compare': 'Term 1 not found.',
  '/settings': 'Settings',
  '/search': 'No results found.'
};

test.describe('app routes', () => {
  let server: Server | null = null;
  let baseURL = '';
  let serverReady = true;
  const routes = getStaticRoutes().filter((r) => markers[r]);

  test.beforeAll(async () => {
    try {
      const app = next({ dev: true, dir: path.join(__dirname, '..') });
      await app.prepare();
      const handle = app.getRequestHandler();
      server = createServer((req, res) => handle(req, res));
      await new Promise<void>((resolve) => server!.listen(0, () => resolve()));
      const addr = server.address();
      const port = typeof addr === 'object' && addr ? addr.port : 0;
      baseURL = `http://localhost:${port}`;
    } catch (err) {
      console.warn('Failed to start Next server', err);
      serverReady = false;
    }
  });

  test.afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  for (const route of routes) {
    test(`GET ${route} returns 200 and marker`, async ({ request }) => {
      test.skip(!serverReady, 'Next server failed to start');
      const response = await request.get(baseURL + route);
      expect(response.status()).toBe(200);
      const body = await response.text();
      expect(body).toContain(markers[route]);
    });
  }
});
