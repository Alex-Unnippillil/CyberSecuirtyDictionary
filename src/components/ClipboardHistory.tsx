'use client';

import React, { useEffect, useState } from 'react';
import copyToClipboard from '../../lib/copyToClipboard';

interface HistoryItem {
  text: string;
  type: 'text' | 'url';
  timestamp: number;
}

const STORAGE_KEY = 'clipboardHistory';

const getType = (text: string): HistoryItem['type'] => {
  return /^https?:\/\//i.test(text.trim()) ? 'url' : 'text';
};

/**
 * ClipboardHistory listens for copy events and stores up to the last
 * ten copied items in localStorage. A small panel displays the history
 * allowing users to copy items again.
 */
const ClipboardHistory: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load existing history on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        /* ignore malformed storage */
      }
    }
  }, []);

  const addItem = React.useCallback((text: string) => {
    setHistory((prev) => {
      const item: HistoryItem = {
        text,
        type: getType(text),
        timestamp: Date.now(),
      };
      const next = [item, ...prev].slice(0, 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  useEffect(() => {
    const handler = async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text.trim()) addItem(text);
      } catch {
        // ignore copy errors
      }
    };
    window.addEventListener('copy', handler);
    return () => window.removeEventListener('copy', handler);
  }, [addItem]);

  const handleCopy = async (text: string) => {
    try {
      await copyToClipboard(text);
      addItem(text);
    } catch {
      // ignore
    }
  };

  if (history.length === 0) return null;

  return (
    <div
      className="clipboard-history"
      style={{
        position: 'fixed',
        bottom: 8,
        right: 8,
        width: 260,
        maxHeight: '50vh',
        overflowY: 'auto',
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: 4,
        padding: 8,
        fontSize: 14,
        zIndex: 1000,
      }}
    >
      <h4 style={{ margin: '0 0 8px 0' }}>Clipboard</h4>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {history.map((item, idx) => (
          <li
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 0',
              borderBottom: idx === history.length - 1 ? 'none' : '1px solid #eee',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                overflow: 'hidden',
                marginRight: 8,
              }}
            >
              <span aria-hidden="true" style={{ marginRight: 4 }}>
                {item.type === 'url' ? '🔗' : '📄'}
              </span>
              <span
                title={item.text}
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.text}
              </span>
            </span>
            <time
              dateTime={new Date(item.timestamp).toISOString()}
              style={{ fontSize: 12, color: '#666', marginRight: 8 }}
            >
              {new Date(item.timestamp).toLocaleTimeString()}
            </time>
            <button
              onClick={() => handleCopy(item.text)}
              style={{ fontSize: 12, color: '#2563eb' }}
            >
              Copy
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClipboardHistory;
