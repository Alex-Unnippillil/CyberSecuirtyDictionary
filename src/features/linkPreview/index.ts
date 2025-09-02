import React from "react";
import ReactDOM from "react-dom";
import LinkPreviewCard, { LinkPreviewData } from "@src/components/LinkPreviewCard";

interface MetaData {
  title?: string;
  description?: string;
  image?: string;
}

// Simple in-memory cache for the session.
const cache = new Map<string, MetaData>();

// Retrieve metadata for a URL using the Jina proxy to bypass CORS.
async function fetchMetadata(url: string): Promise<MetaData | null> {
  if (cache.has(url)) return cache.get(url)!;
  try {
    const res = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const title = doc.querySelector("title")?.textContent || undefined;
    const description =
      doc.querySelector('meta[name="description"], meta[property="og:description"]')?.getAttribute("content") ||
      undefined;
    const image =
      doc.querySelector('meta[property="og:image"], meta[name="twitter:image"]')?.getAttribute("content") ||
      undefined;
    const meta: MetaData = { title, description, image };
    cache.set(url, meta);
    return meta;
  } catch {
    return null;
  }
}

export function initLinkPreview(): void {
  const container = document.createElement("div");
  document.body.appendChild(container);
  let currentUrl: string | null = null;

  const render = (data: LinkPreviewData | null) => {
    if (!data) {
      ReactDOM.unmountComponentAtNode(container);
      return;
    }
    ReactDOM.render(<LinkPreviewCard {...data} />, container);
  };

  const handleMouseOver = async (e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest("a");
    if (!target) return;
    const url = (target as HTMLAnchorElement).href;
    currentUrl = url;
    const meta = await fetchMetadata(url);
    const position = { x: e.clientX, y: e.clientY };
    render({ url, position, ...(meta || {}) });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!currentUrl) return;
    const meta = cache.get(currentUrl) || {};
    render({ url: currentUrl, position: { x: e.clientX, y: e.clientY }, ...meta });
  };

  const handleMouseOut = (e: MouseEvent) => {
    if (!(e.target as HTMLElement).closest("a")) return;
    currentUrl = null;
    render(null);
  };

  document.addEventListener("mouseover", handleMouseOver);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseout", handleMouseOut);
}

export default initLinkPreview;
