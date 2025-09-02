import React, { useState } from "react";
import useSearchHistory from "@hooks/useSearchHistory";

type Props = {
  authenticated?: boolean;
  onSelect?: (query: string) => void;
};

export function HistoryPanel({ authenticated = false, onSelect }: Props) {
  const { history, clearHistory } = useSearchHistory(authenticated);
  const [open, setOpen] = useState(false);

  if (!history.length) return null;

  return (
    <div className="history-panel">
      <button className="toggle" onClick={() => setOpen((v) => !v)}>
        {open ? "Hide" : "Show"} Search History
      </button>
      {open && (
        <div className="history-list">
          <ul>
            {history.map((item, i) => (
              <li key={i}>
                <button type="button" onClick={() => onSelect?.(item)}>
                  {item}
                </button>
              </li>
            ))}
          </ul>
          <button className="clear" onClick={clearHistory}>
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

export default HistoryPanel;
