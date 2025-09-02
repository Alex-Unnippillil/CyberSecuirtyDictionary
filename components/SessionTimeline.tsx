'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Entry {
  slug: string;
  title: string;
}

interface SessionTimelineProps {
  /** Currently viewed term */
  current: Entry;
}

const STORAGE_KEY = 'visited-terms';
const MAX_VISIBLE = 7;

export default function SessionTimeline({ current }: SessionTimelineProps) {
  const [items, setItems] = useState<Entry[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = sessionStorage.getItem(STORAGE_KEY);
    let list: Entry[] = raw ? JSON.parse(raw) : [];
    list = list.filter((e) => e.slug !== current.slug);
    list.push(current);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    setItems(list);
  }, [current]);

  if (items.length === 0) return null;

  let display: Entry[] | (Entry | { slug: string; title: string })[] = items;
  if (items.length > MAX_VISIBLE) {
    const start = items.slice(0, 3);
    const end = items.slice(-3);
    display = [...start, { slug: '', title: '…' }, ...end];
  }

  return (
    <nav aria-label="Visited terms" style={{ marginTop: '1rem' }}>
      <ul
        style={{
          display: 'flex',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          gap: '0.5rem',
          alignItems: 'center',
          flexWrap: 'nowrap',
        }}
      >
        {display.map((item, idx) => (
          <li key={idx} style={{ display: 'flex', alignItems: 'center' }}>
            {item.slug ? (
              <button
                onClick={() => router.push(`/term/${item.slug}`)}
                style={{
                  maxWidth: '8rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: 'blue',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                {item.title}
              </button>
            ) : (
              <span style={{ padding: '0 0.25rem' }}>{item.title}</span>
            )}
            {idx < display.length - 1 && <span style={{ padding: '0 0.25rem' }}>›</span>}
          </li>
        ))}
      </ul>
    </nav>
  );
}

