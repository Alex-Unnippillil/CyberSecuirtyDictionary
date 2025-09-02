'use client';

import { useEffect, useState } from 'react';

interface Bookmark {
  name: string;
  offset: number;
  paragraphId?: string;
}

/**
 * Toolbar for term pages providing bookmark controls.
 */
export default function TermToolbar() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('termBookmarks');
      if (raw) {
        setBookmarks(JSON.parse(raw));
      }
    } catch {
      // Ignore malformed data
    }
  }, []);

  const save = (items: Bookmark[]) => {
    setBookmarks(items);
    if (typeof window !== 'undefined') {
      localStorage.setItem('termBookmarks', JSON.stringify(items));
    }
  };

  // Capture current position and save with user-defined name
  const handleAdd = () => {
    if (typeof window === 'undefined') return;
    const name = prompt('Bookmark name?');
    if (!name) return;
    const offset = window.scrollY;
    let paragraphId: string | undefined;
    const paragraphs = Array.from(document.querySelectorAll('p[id]')) as HTMLElement[];
    for (const p of paragraphs) {
      const rect = p.getBoundingClientRect();
      if (rect.top >= 0) {
        paragraphId = p.id;
        break;
      }
    }
    const updated = [...bookmarks, { name, offset, paragraphId }];
    save(updated);
  };

  // Open bookmark: scroll and flash highlight
  const openBookmark = (b: Bookmark) => {
    if (typeof window === 'undefined') return;
    let target: HTMLElement | null = null;
    if (b.paragraphId) {
      target = document.getElementById(b.paragraphId);
    }
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.classList.add('bookmark-highlight');
      setTimeout(() => target && target.classList.remove('bookmark-highlight'), 1000);
    } else {
      window.scrollTo({ top: b.offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="term-toolbar">
      <button onClick={handleAdd}>Bookmark position</button>
      {bookmarks.length > 0 && (
        <select
          onChange={(e) => {
            const idx = Number(e.target.value);
            if (!isNaN(idx)) {
              openBookmark(bookmarks[idx]);
              e.currentTarget.value = '';
            }
          }}
          defaultValue=""
        >
          <option value="" disabled>
            Open bookmark...
          </option>
          {bookmarks.map((b, i) => (
            <option key={b.name} value={i}>
              {b.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

