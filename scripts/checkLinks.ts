import { JSDOM } from "jsdom";

// Base URL to start crawling from. This defaults to a typical local dev server
// but can be configured via the BASE_URL environment variable.
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const ORIGIN = new URL(BASE_URL).origin;

interface BrokenLink {
  url: string;
  status?: number;
  error?: unknown;
}

const visited = new Set<string>();
const broken: BrokenLink[] = [];

/**
 * Fetches a page, parses its internal anchors, and recursively crawls them.
 * Any request that does not return 200 is logged for the final report.
 */
async function crawl(path: string): Promise<void> {
  const url = new URL(path, BASE_URL).href;
  if (visited.has(url)) return;
  visited.add(url);

  try {
    const res = await fetch(url);
    if (res.status !== 200) {
      broken.push({ url, status: res.status });
      return;
    }

    const type = res.headers.get("content-type") || "";
    if (!type.includes("text/html")) return;

    const html = await res.text();
    const dom = new JSDOM(html);
    const anchors = Array.from(dom.window.document.querySelectorAll("a[href]"));

    for (const anchor of anchors) {
      const href = anchor.getAttribute("href");
      if (!href) continue;
      if (href.startsWith("#")) continue; // Ignore in-page anchors
      const target = new URL(href, BASE_URL);
      if (target.origin !== ORIGIN) continue; // External link
      // Only crawl the pathname + search to avoid loops with hashes
      await crawl(target.pathname + target.search);
    }
  } catch (error) {
    broken.push({ url, error });
  }
}

(async () => {
  await crawl("/");
  console.log(`Checked ${visited.size} pages.`);

  if (broken.length > 0) {
    console.error("Broken links found:");
    for (const b of broken) {
      const detail = b.status ? `status ${b.status}` : String(b.error);
      console.error(`  ${b.url} -> ${detail}`);
    }
    process.exit(1);
  } else {
    console.log("All internal links returned 200. Nice work!");
  }
})();
