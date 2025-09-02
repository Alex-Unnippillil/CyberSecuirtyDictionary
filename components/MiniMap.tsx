import React, { useEffect, useRef, useState } from "react";

interface MiniMapItem {
  id: string;
  text: string;
  level: number;
}

interface MiniMapProps {
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
 * MiniMap renders a fixed navigation of the document headings on the right side.
 * It highlights the currently viewed section and allows the menu to be dismissed.
 */
const MiniMap: React.FC<MiniMapProps> = ({ selector = "h2, h3", offset = 0 }) => {
  const [items, setItems] = useState<MiniMapItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(true);
  const markerRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Build the map of headings when the component mounts.
  useEffect(() => {
    const headings = Array.from(document.querySelectorAll<HTMLElement>(selector));

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
      const level = Number(h.tagName.replace("H", ""));
      return { id, text, level };
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
      requestAnimationFrame(() => {
        const marker = markerRef.current!;
        marker.style.transform = `translateY(${top}px)`;
        marker.style.height = `${height}px`;
      });
    }
  }, [activeId]);

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!visible) return null;

  return (
    <aside
      className="mini-map"
      style={{
        position: "fixed",
        top: "4rem",
        right: "1rem",
        width: "200px",
        maxHeight: "80vh",
        overflowY: "auto",
        background: "#fff",
        border: "1px solid #ddd",
        padding: "0.5rem",
        zIndex: 1000,
      }}
    >
      <button
        className="mini-map__close"
        onClick={() => setVisible(false)}
        style={{
          position: "absolute",
          top: "0.25rem",
          right: "0.25rem",
          background: "transparent",
          border: "none",
          fontSize: "1rem",
          cursor: "pointer",
        }}
        aria-label="Hide mini map"
      >
        ×
      </button>
      <ul ref={listRef} style={{ listStyle: "none", margin: 0, padding: 0, position: "relative" }}>
        <span
          ref={markerRef}
          style={{
            position: "absolute",
            left: 0,
            width: "4px",
            background: "#0070f3",
            transition: "transform 0.2s, height 0.2s",
          }}
        />
        {items.map((item) => (
          <li
            key={item.id}
            className={item.id === activeId ? "active" : undefined}
            style={{ margin: 0 }}
          >
            <a
              href={`#${item.id}`}
              onClick={handleClick(item.id)}
              style={{
                display: "block",
                padding: "0.25rem 0.25rem 0.25rem 0.5rem",
                paddingLeft: item.level === 3 ? "1.5rem" : "0.5rem",
                textDecoration: "none",
                color: item.id === activeId ? "#000" : "#555",
                fontWeight: item.id === activeId ? "bold" : undefined,
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default MiniMap;

