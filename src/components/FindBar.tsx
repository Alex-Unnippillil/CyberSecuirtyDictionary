import React, { useEffect, useRef, useState } from "react";

/**
 * Per-page find bar supporting regex, case sensitivity and whole-word options.
 * Opens with Ctrl/Cmd+F and highlights matches using DOM ranges.
 * Escape clears highlights and closes the bar.
 */
const FindBar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [isRegex, setIsRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const highlightsRef = useRef<HTMLElement[]>([]);

  // Keyboard shortcuts for opening and closing the find bar
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setVisible(true);
        requestAnimationFrame(() => inputRef.current?.select());
      } else if (e.key === "Escape" && visible) {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [visible]);

  // Highlight whenever search parameters change
  useEffect(() => {
    if (!visible) return;
    clearHighlights();
    if (!query) return;
    const regex = buildRegex();
    if (!regex) return;

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName;
          if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    let current: Node | null;
    while ((current = walker.nextNode())) {
      const text = current.nodeValue;
      if (!text) continue;
      const r = new RegExp(regex.source, regex.flags);
      let match: RegExpExecArray | null;
      while ((match = r.exec(text)) !== null) {
        const range = document.createRange();
        range.setStart(current, match.index);
        range.setEnd(current, match.index + match[0].length);
        const mark = document.createElement("mark");
        mark.className = "selection-highlight";
        range.surroundContents(mark);
        highlightsRef.current.push(mark);

        let el: HTMLElement | null = mark.parentElement;
        while (el) {
          if (el instanceof HTMLDetailsElement) {
            el.open = true;
          }
          el = el.parentElement;
        }
      }
    }
  }, [query, isRegex, caseSensitive, wholeWord, visible]);

  // Cleanup on unmount
  useEffect(() => clearHighlights, []);

  const buildRegex = (): RegExp | null => {
    if (!query) return null;
    let pattern = query;
    if (!isRegex) {
      pattern = query.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
    }
    if (wholeWord) {
      pattern = `\\b${pattern}\\b`;
    }
    try {
      return new RegExp(pattern, caseSensitive ? "g" : "gi");
    } catch {
      return null;
    }
  };

  const clearHighlights = (): void => {
    highlightsRef.current.forEach((mark) => {
      const parent = mark.parentNode;
      if (!parent) return;
      parent.replaceChild(
        document.createTextNode(mark.textContent || ""),
        mark
      );
      parent.normalize();
    });
    highlightsRef.current = [];
  };

  const close = (): void => {
    clearHighlights();
    setVisible(false);
    setQuery("");
  };

  if (!visible) return null;

  return (
    <div className="find-bar">
      <input
        ref={inputRef}
        type="text"
        placeholder="Find in page"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={isRegex}
          onChange={(e) => setIsRegex(e.target.checked)}
        />
        Regex
      </label>
      <label>
        <input
          type="checkbox"
          checked={caseSensitive}
          onChange={(e) => setCaseSensitive(e.target.checked)}
        />
        Case sensitive
      </label>
      <label>
        <input
          type="checkbox"
          checked={wholeWord}
          onChange={(e) => setWholeWord(e.target.checked)}
        />
        Whole word
      </label>
    </div>
  );
};

export default FindBar;

