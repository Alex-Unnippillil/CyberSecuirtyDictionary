import { useEffect, useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

const STORAGE_KEY = "searchHistory";

function unique(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

export function useSearchHistory(authenticated: boolean = false) {
  const [history, setHistory] = useState<string[]>([]);

  // Load from localStorage on first mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  const { data } = useSWR<{ history: string[] }>(
    authenticated ? "/api/history" : null,
    { refreshInterval: 0 }
  );

  const { trigger: sync } = useSWRMutation(
    "/api/history",
    async (url, { arg }: { arg: { history: string[] } }) => {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arg),
      });
    }
  );

  // If authenticated, merge server history
  useEffect(() => {
    if (data && Array.isArray(data.history)) {
      setHistory((prev) => unique([...data.history, ...prev]));
    }
  }, [data]);

  // Persist and optionally sync to server
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      /* ignore */
    }
    if (!authenticated) return;
    sync({ history }).catch(() => {
      /* ignore network errors */
    });
  }, [history, authenticated, sync]);

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
