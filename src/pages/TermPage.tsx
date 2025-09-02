import React, { useEffect, useRef, useState } from "react";
import BacklinksPanel from "../components/BacklinksPanel";

interface Term {
  term: string;
  definitions: Record<string, string>;
}

interface TermPageProps {
  term: Term;
}

/**
 * Display a term in two locales side-by-side.
 * Each column has its own locale selector and the columns have
 * synchronized vertical scrolling.
 */
export default function TermPage({ term }: TermPageProps) {
  const locales = Object.keys(term.definitions);
  const [leftLocale, setLeftLocale] = useState(locales[0]);
  const [rightLocale, setRightLocale] = useState(locales[1] ?? locales[0]);

  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // Synchronize scrolling between the two columns.
  useEffect(() => {
    const leftEl = leftRef.current;
    const rightEl = rightRef.current;
    if (!leftEl || !rightEl) return;

    let syncingLeft = false;
    let syncingRight = false;

    const handleLeftScroll = () => {
      if (syncingRight) {
        syncingRight = false;
        return;
      }
      syncingLeft = true;
      rightEl.scrollTop = leftEl.scrollTop;
    };

    const handleRightScroll = () => {
      if (syncingLeft) {
        syncingLeft = false;
        return;
      }
      syncingRight = true;
      leftEl.scrollTop = rightEl.scrollTop;
    };

    leftEl.addEventListener("scroll", handleLeftScroll);
    rightEl.addEventListener("scroll", handleRightScroll);

    return () => {
      leftEl.removeEventListener("scroll", handleLeftScroll);
      rightEl.removeEventListener("scroll", handleRightScroll);
    };
  }, []);

  return (
    <div>
      <h1>{term.term}</h1>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <select
            value={leftLocale}
            onChange={(e) => setLeftLocale(e.target.value)}
            style={{ marginBottom: "0.5rem" }}
          >
            {locales.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <div
            ref={leftRef}
            style={{
              overflowY: "auto",
              maxHeight: "70vh",
              border: "1px solid #ccc",
              padding: "0.5rem",
            }}
          >
            <p>{term.definitions[leftLocale]}</p>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <select
            value={rightLocale}
            onChange={(e) => setRightLocale(e.target.value)}
            style={{ marginBottom: "0.5rem" }}
          >
            {locales.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <div
            ref={rightRef}
            style={{
              overflowY: "auto",
              maxHeight: "70vh",
              border: "1px solid #ccc",
              padding: "0.5rem",
            }}
          >
            <p>{term.definitions[rightLocale]}</p>
          </div>
        </div>
      </div>
      <BacklinksPanel term={term.term} />
    </div>
  );
}
