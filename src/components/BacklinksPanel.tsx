import React, { useEffect, useState } from 'react';
import { loadBacklinks } from '../utils/backlinks';

interface Props {
  term: string;
}

export default function BacklinksPanel({ term }: Props) {
  const [refs, setRefs] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadBacklinks()
      .then((map) => {
        if (!cancelled) {
          setRefs(map[term] || []);
        }
      })
      .catch((err) => {
        console.error('Failed to load backlinks', err);
      });
    return () => {
      cancelled = true;
    };
  }, [term]);

  const openSplitView = (other: string) => {
    const url = `/compare/${encodeURIComponent(other)}-vs-${encodeURIComponent(term)}`;
    window.open(url, '_blank');
  };

  if (refs.length === 0) return null;

  return (
    <aside style={{ marginTop: '1rem' }}>
      <h2>Referenced By</h2>
      <ul>
        {refs.map((r) => (
          <li key={r}>
            <button onClick={() => openSplitView(r)}>{r}</button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
