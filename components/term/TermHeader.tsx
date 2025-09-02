import React, { useEffect, useState } from 'react';
import { fleschKincaid } from '../../src/utils/readability';

interface TermHeaderProps {
  title: string;
  contentRef: React.RefObject<HTMLElement>;
}

function getColor(score: number): string {
  if (score >= 60) return '#16a34a'; // green
  if (score >= 30) return '#facc15'; // yellow
  return '#dc2626'; // red
}

const TermHeader: React.FC<TermHeaderProps> = ({ title, contentRef }) => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const calc = () => {
      if (contentRef.current) {
        const text = contentRef.current.innerText || '';
        setScore(fleschKincaid(text));
      }
    };

    calc();
    if (contentRef.current) {
      const observer = new MutationObserver(() => calc());
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });
      return () => observer.disconnect();
    }
  }, [contentRef]);

  const barColor = getColor(score);
  const width = `${Math.max(0, Math.min(100, score))}%`;

  return (
    <header className="term-header" style={{ marginBottom: '1rem' }}>
      <h1>{title}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div
          style={{
            flex: 1,
            height: '8px',
            background: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width,
              height: '100%',
              background: barColor,
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
          />
        </div>
        <span style={{ fontSize: '0.875rem' }}>{Math.round(score)}</span>
      </div>
    </header>
  );
};

export default TermHeader;
