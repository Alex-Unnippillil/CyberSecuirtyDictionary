'use client';

import React, { useEffect, useState } from 'react';
import termsData from '@/terms.json';

interface Term {
  term: string;
  definition: string;
}

const STORAGE_KEY = 'clipboardPreviewShown';

/**
 * Listens for clipboard copy events and shows a term preview when the copied
 * text matches a term in the dictionary. Uses sessionStorage to avoid
 * repeatedly prompting for the same term during a session.
 */
const ClipboardPreview: React.FC = () => {
  const [term, setTerm] = useState<Term | null>(null);

  useEffect(() => {
    const handleCopy = async () => {
      try {
        const text = await navigator.clipboard.readText();
        const normalized = text.trim().toLowerCase();
        if (!normalized) return;

        const terms = (termsData.terms as Term[]) || [];
        const match = terms.find(
          (t) => t.term.toLowerCase() === normalized,
        );
        if (!match) return;

        const shown: string[] = JSON.parse(
          sessionStorage.getItem(STORAGE_KEY) || '[]',
        );
        if (shown.includes(match.term)) return;

        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify([...shown, match.term]),
        );
        setTerm(match);
      } catch (err) {
        // Permission denied or not supported; ignore silently
      }
    };

    window.addEventListener('copy', handleCopy);
    return () => window.removeEventListener('copy', handleCopy);
  }, []);

  if (!term) return null;

  return (
    <div
      className="clipboard-preview-overlay"
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        className="clipboard-preview"
        style={{
          background: '#fff',
          padding: '1rem',
          borderRadius: '8px',
          maxWidth: '400px',
          width: '90%',
        }}
      >
        <button
          onClick={() => setTerm(null)}
          aria-label="Close preview"
          style={{ float: 'right' }}
        >
          ×
        </button>
        <h3>{term.term}</h3>
        <p>{term.definition}</p>
      </div>
    </div>
  );
};

export default ClipboardPreview;
