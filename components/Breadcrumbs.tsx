import React, { useEffect, useMemo, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
  parent: number;
}

interface BreadcrumbsProps {
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
 * Breadcrumb trail that updates as the reader scrolls.
 * Uses IntersectionObserver for excellent scrolling performance
 * even on very large documents.
 */
export default function Breadcrumbs({
  selector = "h2, h3",
  offset = 0,
}: BreadcrumbsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState("");

  // Build the heading structure and attach observers on mount.
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(selector),
    );

    const mapped: Heading[] = [];
    elements.forEach((el, index) => {
      const text = el.textContent || "";
      const id =
        el.id ||
        text
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      if (!el.id) el.id = id;
      const level = parseInt(el.tagName[1], 10);
      let parent = -1;
      for (let i = index - 1; i >= 0; i--) {
        if (mapped[i].level < level) {
          parent = i;
          break;
        }
      }
      mapped.push({ id, text, level, parent });
    });

    setHeadings(mapped);

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
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector, offset]);

  // Compute breadcrumb trail for the active heading.
  const trail = useMemo(() => {
    if (!activeId) return [];
    const index = headings.findIndex((h) => h.id === activeId);
    if (index === -1) return [];
    const path: Heading[] = [];
    let current = index;
    while (current >= 0) {
      const h = headings[current];
      path.unshift(h);
      current = h.parent;
    }
    return path;
  }, [activeId, headings]);

  function handleClick(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string,
  ) {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav className="breadcrumbs">
      <ul className="breadcrumbs__list">
        {trail.map((h, i) => (
          <li key={h.id} className="breadcrumbs__item">
            {i > 0 && <span className="breadcrumbs__sep">/</span>}
            <a href={`#${h.id}`} onClick={(e) => handleClick(e, h.id)}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
