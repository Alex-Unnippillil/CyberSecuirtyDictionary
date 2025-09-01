'use client';

import { useMemo, useState } from 'react';

interface Term {
  term: string;
  definition: string;
  draft?: boolean;
}

export default function TermsList({ terms }: { terms: Term[] }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () => terms.filter(t => t.term.toLowerCase().includes(query.toLowerCase())),
    [terms, query]
  );

  return (
    <div>
      <div style={{ minHeight: '2.5rem' }}>
        <input
          type="search"
          placeholder="Filter terms..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <ul>
        {filtered.map(t => (
          <li key={t.term}>{t.term}</li>
        ))}
      </ul>
    </div>
  );
}
