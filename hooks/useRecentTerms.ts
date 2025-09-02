import { useEffect, useState } from "react";

const LAST_KEY = "recent-last-term";
const PAIR_KEY = "recent-term-pair";

type Pair = [string, string];

/**
 * Track when two distinct terms are viewed sequentially.
 * Returns the pair and a clear function. Pair persists in sessionStorage
 * until cleared or when navigating away from either term.
 */
export default function useRecentTerms(currentTerm?: string) {
  const [pair, setPair] = useState<Pair | null>(null);

  // Load pair from sessionStorage on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PAIR_KEY);
      if (raw) setPair(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!currentTerm) return;
    try {
      const storedPair = sessionStorage.getItem(PAIR_KEY);
      if (storedPair) {
        const parsed: Pair = JSON.parse(storedPair);
        if (currentTerm !== parsed[0] && currentTerm !== parsed[1]) {
          sessionStorage.removeItem(PAIR_KEY);
          setPair(null);
        } else {
          setPair(parsed);
        }
      } else {
        const last = sessionStorage.getItem(LAST_KEY);
        if (last && last !== currentTerm) {
          const newPair: Pair = [last, currentTerm];
          sessionStorage.setItem(PAIR_KEY, JSON.stringify(newPair));
          setPair(newPair);
        }
      }
      sessionStorage.setItem(LAST_KEY, currentTerm);
    } catch {
      /* ignore */
    }
  }, [currentTerm]);

  const clear = () => {
    try {
      sessionStorage.removeItem(PAIR_KEY);
    } catch {
      /* ignore */
    }
    setPair(null);
  };

  return { pair, clear } as const;
}
