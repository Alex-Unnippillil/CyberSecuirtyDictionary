'use client';

import { useEffect, useState } from 'react';
import { getTags, getTagCounts, Tag } from '../lib/tagDB';

interface Props {
  onSelect: (id: number | null) => void;
  selected?: number | null;
}

/**
 * Lists available tags with counts and notifies when a tag is selected.
 */
export default function TagSidebar({ onSelect, selected }: Props) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [counts, setCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    async function load() {
      try {
        const [t, c] = await Promise.all([getTags(), getTagCounts()]);
        setTags(t);
        setCounts(c);
      } catch {
        setTags([]);
        setCounts({});
      }
    }
    load();
  }, []);

  return (
    <aside className="tag-sidebar">
      <h3>Filter by Tag</h3>
      <ul>
        {tags.map((t) => (
          <li key={t.id}>
            <button
              style={{ background: t.color, opacity: selected === t.id ? 0.8 : 1 }}
              onClick={() => onSelect(t.id!)}
            >
              {t.name} ({counts[t.id!] || 0})
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => onSelect(null)}>Clear</button>
    </aside>
  );
}
