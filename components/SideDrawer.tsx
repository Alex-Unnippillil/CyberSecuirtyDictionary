import React from "react";

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
type CacheEntry = {
  promise: Promise<string>;
  value?: string;
  error?: unknown;
};

const cache = new Map<string, CacheEntry>();

function fetchDefinition(word: string): Promise<string> {
  const storageKey = `definition:${word}`;
  return fetch(`/api/word/summary?word=${encodeURIComponent(word)}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch definition");
      return res.json();
    })
    .then((data) => {
      const def = data.summary || data.definition || "No definition available.";
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch {
        /* ignore storage errors */
      }
      return def;
    })
    .catch((err) => {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        try {
          const data = JSON.parse(cached);
          return data.summary || data.definition || "No definition available.";
        } catch {
          /* ignore parse errors */
        }
      }
      throw err;
    });
}

function readDefinition(word: string): string {
  let entry = cache.get(word);
  if (!entry) {
    const promise = fetchDefinition(word)
      .then((val) => {
        entry!.value = val;
      })
      .catch((err) => {
        entry!.error = err;
      });
    entry = { promise };
    cache.set(word, entry);
  }
  if (entry.error) throw entry.error;
  if (entry.value !== undefined) return entry.value;
  throw entry.promise;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ word, onClose }) => {
  if (!word) return null;
  const definition = readDefinition(word);
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
