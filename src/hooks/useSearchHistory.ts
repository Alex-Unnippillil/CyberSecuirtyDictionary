import { useCallback, useEffect, useState } from "react";
import { safeParse } from "../utils/safeJson";

export interface SearchEntry {
  query: string;
  timestamp: number;
  pinned?: boolean;
}

const STORAGE_KEY = "searchHistory";
const LIMIT = 20;

function load(): SearchEntry[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = safeParse<unknown>(raw, []);
  if (Array.isArray(parsed)) {
    return parsed
      .filter((e: any) => typeof e.query === "string")
      .map((e: any) => ({
        query: e.query,
        timestamp: typeof e.timestamp === "number" ? e.timestamp : Date.now(),
        pinned: !!e.pinned,
      }));
  }
  return [];
}

function trim(entries: SearchEntry[]): SearchEntry[] {
  let next = [...entries].sort((a, b) => b.timestamp - a.timestamp);
  if (next.length <= LIMIT) return next;
  const pinned = next.filter((e) => e.pinned);
  const unpinned = next.filter((e) => !e.pinned);
  const trimmed = [
    ...pinned,
    ...unpinned.slice(0, Math.max(0, LIMIT - pinned.length)),
  ];
  next = trimmed.sort((a, b) => b.timestamp - a.timestamp);
  return next.slice(0, LIMIT);
}

export function useSearchHistory() {
  const [entries, setEntries] = useState<SearchEntry[]>(() => load());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      /* ignore */
    }
  }, [entries]);

  const addQuery = useCallback((query: string) => {
    const q = query.trim();
    if (!q) return;
    setEntries((prev) => {
      const existing = prev.find((e) => e.query === q);
      const pinned = existing?.pinned;
      const next = [
        { query: q, timestamp: Date.now(), pinned },
        ...prev.filter((e) => e.query !== q),
      ];
      return trim(next);
    });
  }, []);

  const togglePin = useCallback((query: string) => {
    setEntries((prev) =>
      trim(
        prev.map((e) =>
          e.query === query ? { ...e, pinned: !e.pinned, timestamp: Date.now() } : e,
        ),
      ),
    );
  }, []);

  const clearHistory = useCallback(() => setEntries([]), []);

  const pinned = entries.filter((e) => e.pinned);
  const history = entries.filter((e) => !e.pinned);

  return { history, pinned, addQuery, togglePin, clearHistory };
}

export default useSearchHistory;

