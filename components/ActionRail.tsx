"use client";
import React, { useEffect, useState } from "react";
import styles from "./ActionRail.module.css";

interface Props {
  onBookmark?: () => void;
  onShare?: () => void;
}

/**
 * Vertical rail with context actions and a reading progress indicator.
 * Hidden on narrow viewports via CSS media queries.
 */
export default function ActionRail({ onBookmark, onShare }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const total = scrollHeight - clientHeight;
      const pct = total > 0 ? scrollTop / total : 0;
      setProgress(pct);
    };
    update();
    window.addEventListener("scroll", update);
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <aside className={styles.rail} aria-label="Context actions">
      <button
        type="button"
        aria-label="Bookmark"
        onClick={onBookmark}
        className={styles.action}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="20"
          height="20"
        >
          <path d="M6 2a2 2 0 00-2 2v18l8-4 8 4V4a2 2 0 00-2-2H6z" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Share"
        onClick={onShare}
        className={styles.action}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="20"
          height="20"
        >
          <path d="M18 16a3 3 0 00-2.24 1.02L8.91 13.7a3 3 0 000-3.39l6.85-3.32A3 3 0 0018 8a3 3 0 10-3-3 3 3 0 00.05.5l-6.86 3.32a3 3 0 100 4.36l6.86 3.32A3 3 0 1018 16z" />
        </svg>
      </button>
      <div className={styles.progress} aria-hidden="true">
        <div
          className={styles.progressBar}
          style={{ height: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </aside>
  );
}
