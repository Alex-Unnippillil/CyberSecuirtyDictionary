import React, { useState, useRef, useEffect, KeyboardEvent } from "react";

interface KeyboardReaderProps {
  paragraphs: string[];
}

/**
 * KeyboardReader allows paragraph-by-paragraph navigation using arrow keys.
 * A caret highlights the active paragraph and the Space key collapses or expands it.
 */
export const KeyboardReader: React.FC<KeyboardReaderProps> = ({
  paragraphs,
}) => {
  const [active, setActive] = useState(0);
  const [collapsed, setCollapsed] = useState(() => paragraphs.map(() => false));
  const refs = useRef<HTMLParagraphElement[]>([]);

  useEffect(() => {
    refs.current[active]?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, paragraphs.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === " ") {
      e.preventDefault();
      setCollapsed((prev) => {
        const next = [...prev];
        next[active] = !next[active];
        return next;
      });
    }
  }

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown} style={{ outline: "none" }}>
      {paragraphs.map((text, idx) => (
        <p
          key={idx}
          ref={(el) => {
            if (el) refs.current[idx] = el;
          }}
          style={{
            position: "relative",
            paddingLeft: "1em",
            maxHeight: collapsed[idx] ? 0 : "none",
            overflow: "hidden",
            transition: "max-height 0.2s ease",
            margin: collapsed[idx] ? 0 : undefined,
          }}
        >
          {idx === active && (
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "4px",
                background: "currentColor",
              }}
            />
          )}
          {text}
        </p>
      ))}
    </div>
  );
};

export default KeyboardReader;
