import React, { useLayoutEffect, useRef, useState } from "react";

interface MediaCaptionProps {
  /**
   * Caption text to display under media.
   */
  children: React.ReactNode;
  /**
   * Number of lines visible before truncation.
   * @default 2
   */
  lines?: number;
}

/**
 * MediaCaption renders an expandable caption. Long captions are
 * truncated to a set number of lines and can be expanded or collapsed
 * without causing layout shift, thanks to explicit height management.
 */
export const MediaCaption: React.FC<MediaCaptionProps> = ({
  children,
  lines = 2,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const collapsedHeightRef = useRef(0);
  const fullHeightRef = useRef(0);
  const [expanded, setExpanded] = useState(false);
  const [needsToggle, setNeedsToggle] = useState(false);
  const [height, setHeight] = useState<number>();

  // Measure heights after first render
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight || "0");
    collapsedHeightRef.current = lineHeight * lines;
    fullHeightRef.current = el.scrollHeight;
    setHeight(collapsedHeightRef.current);
    if (fullHeightRef.current > collapsedHeightRef.current + 1) {
      setNeedsToggle(true);
    }
  }, [children, lines]);

  const toggle = () => {
    setExpanded((prev) => {
      const next = !prev;
      setHeight(next ? fullHeightRef.current : collapsedHeightRef.current);
      return next;
    });
  };

  return (
    <div
      className="media-caption"
      style={{ height, overflow: "hidden", transition: "height 0.3s ease" }}
    >
      <div ref={contentRef}>{children}</div>
      {needsToggle && (
        <button
          type="button"
          className="media-caption__toggle"
          onClick={toggle}
        >
          {expanded ? "less" : "more"}
        </button>
      )}
    </div>
  );
};

export default MediaCaption;

