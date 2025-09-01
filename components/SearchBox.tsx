import { useState, useEffect } from "react";

interface SearchResult {
  id: string | number;
  [key: string]: any;
}

const SearchBox: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error(err);
          }
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {loading && <div className="spinner">Loading...</div>}
      <ul>
        {results.map((result) => (
          <li key={result.id}>{JSON.stringify(result)}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBox;
