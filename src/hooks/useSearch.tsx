import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import safeUrl from "../utils/safeUrl";

interface SearchResult {
  term: string;
  definition: string;
}

interface SearchContextValue {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  fuzziness: number;
  setFuzziness: (f: number) => void;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

const FUZZINESS_KEY = "searchFuzziness";

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [fuzziness, setFuzzinessState] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const raw = window.localStorage.getItem(FUZZINESS_KEY);
    const parsed = parseInt(raw ?? "0", 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  });

  // Persist fuzziness
  useEffect(() => {
    try {
      window.localStorage.setItem(FUZZINESS_KEY, String(fuzziness));
    } catch {
      /* ignore */
    }
  }, [fuzziness]);

  // Refresh results when query or fuzziness change
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    fetch(
      safeUrl(
        `/api/search?q=${encodeURIComponent(query)}&fuzziness=${fuzziness}`,
      ).toString(),
    )
      .then((res) => (res.ok ? res.json() : { results: [] }))
      .then((data) => setResults(data.results || []))
      .catch(() => setResults([]));
  }, [query, fuzziness]);

  const setFuzziness = useCallback((f: number) => {
    setFuzzinessState(f);
  }, []);

  const value: SearchContextValue = {
    query,
    setQuery,
    results,
    fuzziness,
    setFuzziness,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within a SearchProvider");
  return ctx;
}

export default useSearch;
