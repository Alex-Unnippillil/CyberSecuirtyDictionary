import React, { useEffect, useState } from "react";

/**
 * TermToolbar adds optional reading enhancements for term articles.
 * The "Focus" toggle emphasizes the paragraph currently in view or
 * keyboard focus, helping readers concentrate on one idea at a time.
 */
export default function TermToolbar() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState<HTMLElement | null>(null);

  // Apply or remove focus mode classes and listeners
  useEffect(() => {
    const article = document.querySelector<HTMLElement>("article.term");
    if (!article) return;

    const paragraphs = () => Array.from(article.querySelectorAll<HTMLParagraphElement>("p"));

    const clear = () => {
      paragraphs().forEach((p) => {
        p.classList.remove("focused");
        p.removeAttribute("tabindex");
      });
      article.classList.remove("focus-mode");
    };

    if (!enabled) {
      clear();
      return;
    }

    article.classList.add("focus-mode");
    paragraphs().forEach((p) => p.setAttribute("tabindex", "-1"));

    const updateActive = () => {
      const ps = paragraphs();
      let best: HTMLElement | null = null;
      let bestDist = Infinity;
      ps.forEach((p) => {
        const rect = p.getBoundingClientRect();
        const dist = Math.abs(rect.top);
        if (dist < bestDist) {
          bestDist = dist;
          best = p;
        }
      });
      setActive(best);
    };

    updateActive();

    const handleScroll = () => {
      requestAnimationFrame(updateActive);
    };

    const handleFocus = (e: FocusEvent) => {
      const p = (e.target as HTMLElement).closest("p");
      if (p) setActive(p);
    };

    window.addEventListener("scroll", handleScroll, true);
    document.addEventListener("focusin", handleFocus);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("focusin", handleFocus);
      clear();
    };
  }, [enabled]);

  // Highlight the active paragraph
  useEffect(() => {
    if (!enabled) return;
    const article = document.querySelector<HTMLElement>("article.term");
    if (!article) return;
    const ps = Array.from(article.querySelectorAll<HTMLParagraphElement>("p"));
    ps.forEach((p) => {
      if (p === active) p.classList.add("focused");
      else p.classList.remove("focused");
    });
  }, [active, enabled]);

  return (
    <>
      <div className="term-toolbar">
        <label>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />{" "}
          Focus
        </label>
      </div>
      <style jsx global>{`
        article.term.focus-mode p {
          opacity: 0.4;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        article.term.focus-mode p.focused {
          opacity: 1;
          transform: scale(1.05);
        }
        @media (prefers-reduced-motion: reduce) {
          article.term.focus-mode p {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
