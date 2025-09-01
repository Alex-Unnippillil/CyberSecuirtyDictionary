'use client';

import { useEffect, useState } from 'react';

const SOURCES = ['NIST', 'OWASP', 'MITRE'];

export default function SettingsPage() {
  const [preferred, setPreferred] = useState<string | null>(null);

  // Load preference from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('preferredSource');
    if (stored && SOURCES.includes(stored)) {
      setPreferred(stored);
    }
  }, []);

  const handleToggle = (source: string) => {
    const next = preferred === source ? null : source;
    setPreferred(next);
    if (next) {
      localStorage.setItem('preferredSource', next);
    } else {
      localStorage.removeItem('preferredSource');
    }
  };

  const orderedSources = preferred
    ? [preferred, ...SOURCES.filter((s) => s !== preferred)]
    : SOURCES;

  // Persist ordered sources
  useEffect(() => {
    localStorage.setItem('sourceOrder', JSON.stringify(orderedSources));
  }, [orderedSources]);

  return (
    <main>
      <h1>Settings</h1>
      <section>
        <h2>Source Preference</h2>
        {SOURCES.map((source) => (
          <label key={source} style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input
              type="checkbox"
              checked={preferred === source}
              onChange={() => handleToggle(source)}
            />
            Prefer {source}
          </label>
        ))}
      </section>
      <section>
        <h2>Current Source Order</h2>
        <ol>
          {orderedSources.map((source) => (
            <li key={source}>{source}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}

