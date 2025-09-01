import React, { useEffect, useRef, useState } from "react";

interface TOCItem {
  id: string;
  text: string;
}

interface TOCProps {
  /**
   * Selector used to find headings in the document.
   * Defaults to all h2 and h3 elements.
   */
  selector?: string;
  /**
   * Top offset in pixels before a heading is considered active.
   */
  offset?: number;
}

/**
 * Table of contents that tracks headings in the page.
 * Uses IntersectionObserver for excellent scrolling performance
 * even on very large documents.
 */
const TOC: React.FC<TOCProps> = ({ selector = "h2, h3", offset = 0 }) => {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const markerRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Build the TOC and attach observers when the component mounts.
  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(selector)
    );

    const mapped = headings.map((h) => {
      const text = h.textContent || "";
      const id =
        h.id ||
        text
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      if (!h.id) h.id = id;
      return { id, text };
    });

    setItems(mapped);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${offset}px 0px -80% 0px`,
        threshold: 0,
      }
    );

    headings.forEach((h) => observer.observe(h));

    return () => observer.disconnect();
  }, [selector, offset]);

  // Animate marker to align with the active list item.
  useEffect(() => {
    if (!listRef.current || !markerRef.current) return;
    const link = listRef.current.querySelector<HTMLElement>(
      `a[href="#${CSS.escape(activeId)}"]`
    );
    if (link) {
      const top = link.offsetTop;
      const height = link.offsetHeight;
      // Use requestAnimationFrame to keep animation smooth.
      requestAnimationFrame(() => {
        const marker = markerRef.current!;
        marker.style.transform = `translateY(${top}px)`;
        marker.style.height = `${height}px`;
      });
    }
  }, [activeId]);

  return (
    <nav className="toc">
      <ul ref={listRef} className="toc__list">
        {/* Marker is absolutely positioned inside the list. */}
        <span ref={markerRef} className="toc__marker" />
        {items.map((item) => (
          <li
            key={item.id}
            className={item.id === activeId ? "active" : undefined}
          >
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TOC;
