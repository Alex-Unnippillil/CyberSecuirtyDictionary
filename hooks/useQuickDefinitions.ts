import { useEffect } from "react";

interface Term {
  term: string;
  definition: string;
}

interface TermMap {
  [slug: string]: string;
}

function slugify(term: string): string {
  return term.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Displays quick definitions for term links while the Alt key is held.
 * Adds ARIA tooltip semantics for better keyboard accessibility.
 */
export function useQuickDefinitions() {
  useEffect(() => {
    let termMap: TermMap = {};
    let overlays: HTMLElement[] = [];

    // Load term definitions once
    fetch("/terms.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { terms: Term[] } | null) => {
        if (!data) return;
        termMap = data.terms.reduce<TermMap>((acc, t) => {
          acc[slugify(t.term)] = t.definition;
          return acc;
        }, {});
      })
      .catch(() => {
        /* ignore network errors */
      });

    const show = () => {
      if (overlays.length) return;
      const links = Array.from(
        document.querySelectorAll<HTMLAnchorElement>('a[href^="/word/"]')
      );
      links.forEach((link, i) => {
        const href = link.getAttribute("href") || "";
        const slug = slugify(
          decodeURIComponent(href.replace(/^\/word\//, "").replace(/\/$/, ""))
        );
        const def = termMap[slug];
        if (!def) return;
        const tip = document.createElement("span");
        tip.textContent = def;
        tip.id = `quick-def-${i}`;
        tip.setAttribute("role", "tooltip");
        tip.setAttribute("aria-hidden", "false");
        tip.style.position = "absolute";
        tip.style.zIndex = "1000";
        tip.style.background = "#000";
        tip.style.color = "#fff";
        tip.style.padding = "4px 8px";
        tip.style.borderRadius = "4px";
        tip.style.maxWidth = "250px";
        tip.style.fontSize = "0.85rem";
        const rect = link.getBoundingClientRect();
        tip.style.top = `${rect.bottom + window.scrollY}px`;
        tip.style.left = `${rect.left + window.scrollX}px`;
        document.body.appendChild(tip);
        link.setAttribute("aria-describedby", tip.id);
        overlays.push(tip);
      });
    };

    const hide = () => {
      overlays.forEach((tip) => {
        const id = tip.id;
        document
          .querySelectorAll(`a[aria-describedby="${id}"]`)
          .forEach((link) => link.removeAttribute("aria-describedby"));
        tip.remove();
      });
      overlays = [];
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) show();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.altKey) hide();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      hide();
    };
  }, []);
}

export default useQuickDefinitions;
