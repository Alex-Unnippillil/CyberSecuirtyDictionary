import React, { useEffect, useState } from 'react';

const DEFAULT_DELAY = 500;

function getStoredDelay(): number {
  if (typeof window === 'undefined') return DEFAULT_DELAY;
  const raw = localStorage.getItem('hoverPreviewDelay');
  const value = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(value) ? value : DEFAULT_DELAY;
}

export default function HoverPreview() {
  const isTouch =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: none)').matches;
  const [delay, setDelay] = useState<number>(getStoredDelay);

  useEffect(() => {
    if (isTouch) return;
    try {
      localStorage.setItem('hoverPreviewDelay', String(delay));
    } catch {
      // ignore
    }
  }, [delay, isTouch]);

  return (
    <div
      id="hover-preview-delay"
      data-setting-label="Preview delay"
      data-setting-keywords="hover,preview,delay"
    >
      <label htmlFor="hover-delay">
        Preview delay: {delay}ms
      </label>
      <input
        id="hover-delay"
        type="range"
        min={0}
        max={2000}
        step={100}
        value={delay}
        onChange={(e) => setDelay(parseInt(e.target.value, 10))}
        disabled={isTouch}
      />
      {isTouch && <p>Not available on touch devices.</p>}
    </div>
  );
}
