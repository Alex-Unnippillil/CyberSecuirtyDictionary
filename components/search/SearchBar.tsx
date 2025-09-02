"use client";

import { useRouter } from "next/navigation";
import Autocomplete from "./Autocomplete";
import HistoryPanel from "./HistoryPanel";
import useSearchHistory from "../../src/hooks/useSearchHistory";

export default function SearchBar() {
  const router = useRouter();
  const { history, pinned, addQuery, togglePin, clearHistory } =
    useSearchHistory();

  const handleCommit = (value: string) => {
    const query = value.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    addQuery(query);
  };

  const entries = [...pinned, ...history];

  return (
    <div>
      <Autocomplete onCommit={handleCommit} pinned={pinned.map((p) => p.query)} />
      <HistoryPanel
        entries={entries}
        onSelect={handleCommit}
        onPinToggle={togglePin}
        onClear={clearHistory}
      />
    </div>
  );
}
