'use client';
import { useState } from 'react';

export default function ExpandTerm({ term, definition }: { term: string; definition: string }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleExpand() {
    setLoading(true);
    try {
      const res = await fetch('/api/expand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term, definition }),
      });
      const data = await res.json();
      setExpanded(data.expanded);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button className="border p-2 mt-2" onClick={handleExpand} disabled={loading}>
        {loading ? 'Expanding...' : 'AI Expand'}
      </button>
      {expanded && <p className="mt-2">{expanded}</p>}
    </div>
  );
}
