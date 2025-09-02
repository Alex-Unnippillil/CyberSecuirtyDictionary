import React, { useEffect, useMemo, useState } from 'react';

export interface Highlight {
  id: string;
  /** Hex color or any valid CSS color representing the highlight */
  color: string;
  /** User friendly label shown in the drawer */
  label: string;
  /** The DOM id of the entry associated with the highlight */
  elementId: string;
  /** Start offset in the associated text where the highlight begins */
  start?: number;
  /** End offset in the associated text where the highlight ends */
  end?: number;
}

export interface HighlightsDrawerProps {
  /** Collection of highlights to render */
  highlights: Highlight[];
}

/**
 * Drawer showing all highlights with the ability to filter by colour.
 * Selecting an item scrolls the related entry into the centre of the viewport.
 */
export const HighlightsDrawer: React.FC<HighlightsDrawerProps> = ({
  highlights,
}) => {
  // Locally managed copy of highlights that updates via events
  const [items, setItems] = useState<Highlight[]>(highlights);
  // Currently selected color to filter on. `null` represents no filtering.
  const [filter, setFilter] = useState<string | null>(null);

  // Keep local state in sync with incoming props
  useEffect(() => setItems(highlights), [highlights]);

  // Listen for highlight-change events to update immediately
  useEffect(() => {
    const handler = (e: CustomEvent<Highlight[]>) => setItems(e.detail);
    window.addEventListener(
      'highlight-change',
      handler as EventListener,
    );
    return () =>
      window.removeEventListener(
        'highlight-change',
        handler as EventListener,
      );
  }, []);

  // Unique set of colors represented in the highlight collection
  const colors = useMemo(
    () => Array.from(new Set(items.map((h) => h.color))),
    [items],
  );

  // Apply color filter
  const filtered = filter
    ? items.filter((h) => h.color === filter)
    : items;

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
          aria-label="Show all highlights"
        >
          All
        </button>
        {colors.map((color) => (
          <button
            key={color}
            className={filter === color ? 'active' : ''}
            style={{ backgroundColor: color }}
            onClick={() => setFilter(color)}
            aria-label={`Filter ${color} highlights`}
            aria-pressed={filter === color}
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
              aria-label={`Jump to ${h.label}`}
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
