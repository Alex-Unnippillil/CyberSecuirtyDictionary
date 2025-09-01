import React, { useState, useEffect } from 'react';
import Spinner from '../Spinner';
import { search } from '../../lib/api/search';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const handle = setTimeout(() => {
      setLoading(true);
      search(query)
        .then((data) => setResults(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      clearTimeout(handle);
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
      {loading && <Spinner />}
      {results.length > 0 && (
        <ul>
          {results.map((item, idx) => (
            <li key={idx}>{String(item)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
