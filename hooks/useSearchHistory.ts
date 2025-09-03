import { useEffect, useState } from "react";
import { safeParse } from "../src/utils/safeJson";

const STORAGE_KEY = "searchHistory";

function unique(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

export function useSearchHistory(authenticated: boolean = false) {
  const [history, setHistory] = useState<string[]>([]);

  // Load from localStorage on first mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = safeParse<unknown>(raw, []);
    if (Array.isArray(parsed)) {
      setHistory(parsed as string[]);
    }
  }, []);

  // If authenticated, merge server history
  useEffect(() => {
    if (!authenticated) return;
    fetch("/api/history")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.history)) {
          setHistory((prev) => unique([...data.history, ...prev]));
        }
      })
      .catch(() => {
        /* ignore network errors */
      });
  }, [authenticated]);

  // Persist and optionally sync to server
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      /* ignore */
    }
    if (!authenticated) return;
    fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history }),
    }).catch(() => {
      /* ignore network errors */
    });
  }, [history, authenticated]);

  const addQuery = (query: string) => {
    const q = query.trim();
    if (!q) return;
    setHistory((prev) => {
      const next = prev.filter((h) => h !== q);
      next.unshift(q);
      return next.slice(0, 50);
    });
  };

  const clearHistory = () => setHistory([]);

  return { history, addQuery, clearHistory };
}

export default useSearchHistory;
