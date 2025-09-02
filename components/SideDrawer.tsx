import React from "react";
import useSWR from "swr";

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
  const { data, error } = useSWR(
    word ? `/api/word/summary?word=${encodeURIComponent(word)}` : null,
    { refreshInterval: 300000 }
  );

  if (!word) return null;

  const definition = error
    ? "Failed to fetch definition."
    : data?.summary || data?.definition || "No definition available.";

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
