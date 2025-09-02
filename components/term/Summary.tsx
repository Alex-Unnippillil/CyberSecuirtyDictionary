"use client";

import { useEffect, useState } from "react";

interface TermSummaryProps {
  title: string;
  points: string[];
}

/**
 * Renders a toggleable summary list for a term.
 * The visible state is stored in localStorage per term.
 */
export default function TermSummary({ title, points }: TermSummaryProps) {
  const storageKey = `summary-visible-${encodeURIComponent(title)}`;
  const listId = `summary-${encodeURIComponent(title)}`;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored !== null) {
      setVisible(stored === "true");
    }
  }, [storageKey]);

  const toggle = () => {
    const next = !visible;
    setVisible(next);
    window.localStorage.setItem(storageKey, String(next));
  };

  if (!points || points.length === 0) {
    return null;
  }

  return (
    <section className="term-summary">
      <button onClick={toggle} aria-expanded={visible} aria-controls={listId}>
        {visible ? "Hide summary" : "Show summary"}
      </button>
      {visible && (
        <ul id={listId}>
          {points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
