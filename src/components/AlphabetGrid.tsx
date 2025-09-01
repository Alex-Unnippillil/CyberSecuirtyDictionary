import React, { useMemo, useRef, useState, useEffect } from "react";

interface Term {
  term: string;
  [key: string]: unknown;
}

interface AlphabetGridProps {
  terms: Term[];
}

const LETTERS = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i),
);
const COLUMN_COUNT = 6; // number of columns used for keyboard navigation

/**
 * Alphabet grid navigation component.
 *
 * Displays A-Z links pointing to the first term beginning with each letter.
 * Letters without corresponding terms are visually disabled and skipped when
 * navigating with the keyboard.
 */
const AlphabetGrid: React.FC<AlphabetGridProps> = ({ terms }) => {
  // Map each letter to the first term starting with that letter
  const letterToTerm = useMemo(() => {
    const mapping: Record<string, string | null> = {};
    LETTERS.forEach((l) => (mapping[l] = null));

    const sorted = [...terms].sort((a, b) => a.term.localeCompare(b.term));
    for (const { term } of sorted) {
      const first = term.charAt(0).toUpperCase();
      if (mapping[first] === null) {
        mapping[first] = term;
      }
    }
    return mapping;
  }, [terms]);

  // Determine initial active index (first available letter)
  const initialIndex = useMemo(() => {
    const idx = LETTERS.findIndex((l) => letterToTerm[l]);
    return idx === -1 ? 0 : idx;
  }, [letterToTerm]);

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const refs = useRef<(HTMLAnchorElement | HTMLSpanElement | null)[]>([]);

  // Focus the active element when activeIndex changes
  useEffect(() => {
    const el = refs.current[activeIndex];
    if (el && "focus" in el) {
      (el as HTMLElement).focus();
    }
  }, [activeIndex]);

  const moveFocus = (start: number, delta: number) => {
    const direction = Math.sign(delta);
    let next = start + delta;
    while (next >= 0 && next < LETTERS.length) {
      if (letterToTerm[LETTERS[next]]) break;
      next += direction;
    }
    if (next >= 0 && next < LETTERS.length) {
      setActiveIndex(next);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        moveFocus(index, 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        moveFocus(index, -1);
        break;
      case "ArrowDown":
        e.preventDefault();
        moveFocus(index, COLUMN_COUNT);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveFocus(index, -COLUMN_COUNT);
        break;
      default:
        break;
    }
  };

  return (
    <div className="alphabet-grid" role="grid">
      {LETTERS.map((letter, idx) => {
        const term = letterToTerm[letter];
        const isDisabled = !term;
        const commonProps = {
          key: letter,
          ref: (el: HTMLAnchorElement | HTMLSpanElement | null) =>
            (refs.current[idx] = el),
          tabIndex: idx === activeIndex ? 0 : -1,
          onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, idx),
          onFocus: () => setActiveIndex(idx),
          role: "gridcell" as const,
          className: `alphabet-grid__cell${isDisabled ? " alphabet-grid__cell--disabled" : ""}`,
        };

        if (isDisabled) {
          return (
            <span
              {...commonProps}
              aria-disabled="true"
              style={{ color: "#999" }}
            >
              {letter}
            </span>
          );
        }

        return (
          <a
            {...commonProps}
            href={`#${encodeURIComponent(term!)}`}
            style={{ textDecoration: "none" }}
          >
            {letter}
          </a>
        );
      })}
    </div>
  );
};

export default AlphabetGrid;
