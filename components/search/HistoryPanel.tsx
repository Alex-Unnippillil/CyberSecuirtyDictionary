import React from "react";
import { SearchEntry } from "../../src/hooks/useSearchHistory";

type Props = {
  entries: SearchEntry[];
  onSelect?: (query: string) => void;
  onPinToggle?: (query: string) => void;
  onClear?: () => void;
};

export function HistoryPanel({ entries, onSelect, onPinToggle, onClear }: Props) {
  if (!entries.length) return null;

  return (
    <div className="history-panel">
      <ul>
        {entries.map((item) => (
          <li key={item.query}>
            <button type="button" onClick={() => onSelect?.(item.query)}>
              {item.query}
            </button>
            <button type="button" onClick={() => onPinToggle?.(item.query)}>
              {item.pinned ? "Unpin" : "Pin"}
            </button>
          </li>
        ))}
      </ul>
      <button className="clear" onClick={onClear}>
        Clear
      </button>
    </div>
  );
}

export default HistoryPanel;
