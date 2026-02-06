import React from 'react';
import { loadBacklinks, BacklinkMap } from '../utils/backlinks';

interface Props {
  term: string;
}

let cache: BacklinkMap | null = null;
let promise: Promise<BacklinkMap> | null = null;
let error: unknown = null;

function useBacklinks(): BacklinkMap {
  if (cache) return cache;
  if (error) throw error;
  if (!promise) {
    promise = loadBacklinks()
      .then((map) => {
        cache = map;
        return map;
      })
      .catch((err) => {
        error = err;
        throw err;
      });
  }
  throw promise;
}

export default function BacklinksPanel({ term }: Props) {
  const map = useBacklinks();
  const refs = map[term] || [];

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
