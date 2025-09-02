'use client';

import React, { useMemo } from 'react';
import termsData from '../../terms.json';

interface Term {
  term: string;
  definition: string;
}

interface SplitViewProps {
  termA: string;
  termB: string;
  onClose?: () => void;
}

/**
 * Simple side-by-side view showing definitions for two terms. Used by the
 * relation matrix when a cell is selected.
 */
export default function SplitView({ termA, termB, onClose }: SplitViewProps) {
  const termMap = useMemo(() => {
    return Object.fromEntries(
      (termsData as { terms: Term[] }).terms.map((t) => [
        t.term.toLowerCase(),
        t,
      ]),
    );
  }, []);

  const left = termMap[termA.toLowerCase()];
  const right = termMap[termB.toLowerCase()];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        overflow: 'auto',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: '#fff',
          margin: '5% auto',
          padding: '1rem',
          maxWidth: '900px',
        }}
      >
        <div style={{ textAlign: 'right' }}>
          <button onClick={onClose}>Close</button>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <section style={{ flex: 1 }}>
            <h2>{left?.term ?? termA}</h2>
            <p>{left?.definition ?? 'Definition not found.'}</p>
          </section>
          <section style={{ flex: 1 }}>
            <h2>{right?.term ?? termB}</h2>
            <p>{right?.definition ?? 'Definition not found.'}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

