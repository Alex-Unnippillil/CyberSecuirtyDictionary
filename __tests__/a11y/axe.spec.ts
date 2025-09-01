import { readFileSync } from 'fs';
import { join } from 'path';
import { JSDOM } from 'jsdom';
import assert from 'assert/strict';

const pages = ['index.html', 'search.html', 'diagnostics.html'];

async function runAxe(file: string) {
  const html = readFileSync(join(process.cwd(), file), 'utf8');
  const dom = new JSDOM(html);
  const { window } = dom;

  // Stub canvas to avoid jsdom not implemented errors
  (window.HTMLCanvasElement.prototype as any).getContext = () => null;

  // Expose globals required by axe
  (globalThis as any).window = window;
  (globalThis as any).document = window.document;
  (globalThis as any).Node = window.Node;

  try {
    const axe = require('axe-core');
    const results = await axe.run(window.document);
    const critical = results.violations.filter((v: any) => v.impact === 'critical');
    assert.strictEqual(
      critical.length,
      0,
      `Critical accessibility violations in ${file}:\n${critical.map((v: any) => `${v.id} - ${v.help}`).join('\n')}`
    );
    console.log(`${file} has no critical accessibility violations`);
  } finally {
    delete (globalThis as any).window;
    delete (globalThis as any).document;
    delete (globalThis as any).Node;
  }
}

(async () => {
  for (const page of pages) {
    await runAxe(page);
  }
})();
