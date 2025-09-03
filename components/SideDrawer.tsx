import React, { useEffect, useState } from "react";
import { safeParse } from "../src/utils/safeJson";

interface SideDrawerProps {
  /** Word currently selected; when null the drawer is hidden */
  word: string | null;
  /** Called when the drawer should be closed */
  onClose: () => void;
}

/**
 * SideDrawer fetches and displays a mini definition for a given word.
 * It is shown whenever `word` is not null.
 */
const SideDrawer: React.FC<SideDrawerProps> = ({ word, onClose }) => {
  const [definition, setDefinition] = useState<string>("");

  useEffect(() => {
    if (!word) {
      setDefinition("");
      return;
    }

    let cancelled = false;
    const storageKey = `definition:${word}`;

    async function load() {
      try {
        const res = await fetch(
          `/api/word/summary?word=${encodeURIComponent(word)}`,
        );
        if (!res.ok) throw new Error("Failed to fetch definition");
        const data = await res.json();
        if (!cancelled) {
          const def =
            data.summary || data.definition || "No definition available.";
          setDefinition(def);
          try {
            localStorage.setItem(storageKey, JSON.stringify(data));
          } catch {
            /* ignore storage errors */
          }
        }
      } catch {
        if (!cancelled) {
          const cached = localStorage.getItem(storageKey);
          const data = safeParse<any>(cached, null);
          if (data) {
            setDefinition(
              data.summary || data.definition || "No definition available.",
            );
            return;
          }
          setDefinition("Failed to fetch definition.");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [word]);

  if (!word) return null;

  return (
    <aside className="side-drawer">
      <button className="close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h2>{word}</h2>
      <p>{definition}</p>
    </aside>
  );
};

export default SideDrawer;
