'use client';
import { useEffect, useState } from 'react';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ term: string; slug: string }[]>([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: ctrl.signal })
      .then((res) => res.json())
      .then((data) => setResults(data));
    return () => ctrl.abort();
  }, [query]);

  return (
    <div>
      <input
        className="border p-2"
        placeholder="Search terms"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {results.map((r) => (
          <li key={r.slug}>{r.term}</li>
        ))}
      </ul>
    </div>
  );
}
