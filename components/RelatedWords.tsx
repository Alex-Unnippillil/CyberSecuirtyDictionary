import React, { useState } from "react";
import SideDrawer from "./SideDrawer";

interface RelatedWordsProps {
  /** List of words related to the current term */
  words: string[];
}

/**
 * Renders a collection of chips for related words. Clicking a chip opens a
 * SideDrawer with a mini definition fetched from `/api/word/summary`.
 */
const RelatedWords: React.FC<RelatedWordsProps> = ({ words }) => {
  const [selected, setSelected] = useState<string | null>(null);

  if (!words || words.length === 0) return null;

  return (
    <div className="related-words">
      <div className="chips">
        {words.map((w) => (
          <button key={w} className="chip" onClick={() => setSelected(w)}>
            {w}
          </button>
        ))}
      </div>
      <SideDrawer word={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default RelatedWords;
