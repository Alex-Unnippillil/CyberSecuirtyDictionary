import React, { useEffect, useState } from "react";

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
    // Fetch the mini definition for the selected word
    fetch(`/api/word/summary?word=${encodeURIComponent(word)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setDefinition(
            data.summary || data.definition || "No definition available.",
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDefinition("Failed to fetch definition.");
        }
      });

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
