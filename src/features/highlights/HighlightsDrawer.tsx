import React, { useMemo, useState } from 'react';

export interface Highlight {
  id: string;
  /** Hex color or any valid CSS color representing the highlight */
  color: string;
  /** User friendly label shown in the drawer */
  label: string;
  /** The DOM id of the entry associated with the highlight */
  elementId: string;
}

export interface HighlightsDrawerProps {
  /** Collection of highlights to render */
  highlights: Highlight[];
}

/**
 * Drawer showing all highlights with the ability to filter by colour.
 * Selecting an item scrolls the related entry into the centre of the viewport.
 */
export const HighlightsDrawer: React.FC<HighlightsDrawerProps> = ({ highlights }) => {
  // Currently selected colour to filter on. `null` represents no filtering.
  const [filter, setFilter] = useState<string | null>(null);

  // Unique set of colours represented in the highlight collection
  const colours = useMemo(
    () => Array.from(new Set(highlights.map((h) => h.color))),
    [highlights]
  );

  // Apply colour filter
  const filtered = filter ? highlights.filter((h) => h.color === filter) : highlights;

  // Scroll to the element tied to the highlight and centre it in the viewport
  const handleSelect = (highlight: Highlight): void => {
    const element = document.getElementById(highlight.elementId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="highlights-drawer">
      <div className="highlights-drawer__filters">
        <button
          className={filter === null ? 'active' : ''}
          onClick={() => setFilter(null)}
        >
          All
        </button>
        {colours.map((colour) => (
          <button
            key={colour}
            className={filter === colour ? 'active' : ''}
            style={{ backgroundColor: colour }}
            onClick={() => setFilter(colour)}
            aria-label={`Filter ${colour} highlights`}
          />
        ))}
      </div>
      <ul className="highlights-drawer__list">
        {filtered.map((h) => (
          <li key={h.id}>
            <button
              className="highlights-drawer__item"
              style={{ borderLeft: `4px solid ${h.color}` }}
              onClick={() => handleSelect(h)}
            >
              {h.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HighlightsDrawer;
