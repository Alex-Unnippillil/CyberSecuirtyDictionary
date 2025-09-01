import React, { useEffect, useState } from "react";

interface HistoryItem {
  query: string;
  timestamp: string;
}

const SEARCH_HISTORY_KEY = "searchHistory";

export default function SearchHistory() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const clearAll = () => {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
    setHistory([]);
    const token = localStorage.getItem("authToken");
    if (token) {
      fetch("/api/history", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  };

  return (
    <div className="search-history">
      <button type="button" onClick={() => setOpen(!open)}>
        {open ? "Hide" : "Show"} Search History
      </button>
      {open && (
        <div>
          <ul>
            {history.map((item, idx) => (
              <li key={idx}>
                <time dateTime={item.timestamp}>
                  {new Date(item.timestamp).toLocaleString()}
                </time>
                {": "}
                {item.query}
              </li>
            ))}
          </ul>
          <button type="button" onClick={clearAll}>
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
