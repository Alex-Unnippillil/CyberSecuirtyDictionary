'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ErrorBoundary from '../../components/ErrorBoundary';

interface Term {
  term: string;
  definition: string;
}

interface SearchResponse {
  results: Term[];
  suggestions: string[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [data, setData] = useState<SearchResponse | null>(null);

  useEffect(() => {
    if (!query) return;
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData({ results: [], suggestions: [] }));
  }, [query]);

  const results = data?.results || [];
  const suggestions = data?.suggestions || [];

  return (
    <ErrorBoundary>
      <div>
        {suggestions.length > 0 && (
          <div className="suggestions">
            <p>Did you mean:</p>
            <ul>
              {suggestions.map((s) => (
                <li key={s}>
                  <Link href={`/search?q=${encodeURIComponent(s)}`}>{s}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <ul>
          {results.map((r) => (
            <li key={r.term}>
              <strong>{r.term}</strong>: {r.definition}
            </li>
          ))}
          {results.length === 0 && <li>No results found.</li>}
        </ul>
      </div>
    </ErrorBoundary>
  );
}

