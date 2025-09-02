import React, { useEffect, useRef, useState } from "react";

interface ScrollThumbnailsProps {
  /** CSS selector used to gather sections. Each element must have an `id`. */
  sectionSelector?: string;
  /** Width of each thumbnail in pixels */
  thumbWidth?: number;
  /** Height of each thumbnail in pixels */
  thumbHeight?: number;
}

/**
 * ScrollThumbnails renders a hoverable strip of miniature previews for the
 * document's major sections. Clicking a thumbnail scrolls to that section and
 * the thumbnail of the section currently in view is highlighted.
 */
export default function ScrollThumbnails({
  sectionSelector = "section",
  thumbWidth = 80,
  thumbHeight = 60,
}: ScrollThumbnailsProps) {
  const [sections, setSections] = useState<HTMLElement[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);

  // Collect sections and observe which one is currently in view
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(sectionSelector),
    ).filter((el) => el.id);
    setSections(els);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "0px 0px -80% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionSelector]);

  const handleClick = (el: HTMLElement) => {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "4px",
        padding: "4px",
        background: "rgba(255,255,255,0.9)",
        borderTop: "1px solid #ccc",
        boxShadow: "0 -2px 4px rgba(0,0,0,0.1)",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.3s",
        maxWidth: "100%",
        overflowX: "auto",
        zIndex: 1000,
      }}
    >
      {sections.map((section) => (
        <div
          key={section.id}
          onClick={() => handleClick(section)}
          style={{
            width: thumbWidth,
            height: thumbHeight,
            overflow: "hidden",
            cursor: "pointer",
            border:
              section.id === activeId ? "2px solid #2196f3" : "1px solid #ccc",
            flex: "0 0 auto",
            background: "#fff",
            boxSizing: "border-box",
          }}
        >
          <Thumbnail section={section} width={thumbWidth} height={thumbHeight} />
        </div>
      ))}
    </div>
  );
}

interface ThumbnailProps {
  section: HTMLElement;
  width: number;
  height: number;
}

/** Clone and scale a section to create a miniature preview */
function Thumbnail({ section, width, height }: ThumbnailProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const clone = section.cloneNode(true) as HTMLElement;
    clone.style.pointerEvents = "none";
    clone.style.margin = "0";
    clone.style.transformOrigin = "top left";
    const scale = Math.min(width / section.offsetWidth, height / section.offsetHeight);
    clone.style.transform = `scale(${scale})`;
    clone.style.width = `${section.offsetWidth}px`;
    clone.style.height = `${section.offsetHeight}px`;
    ref.current.innerHTML = "";
    ref.current.appendChild(clone);
  }, [section, width, height]);

  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
}
