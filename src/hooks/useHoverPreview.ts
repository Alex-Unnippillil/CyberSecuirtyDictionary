import React, { useRef } from 'react';

const DEFAULT_DELAY = 500;

function getDelay(): number {
  if (typeof window === 'undefined') return DEFAULT_DELAY;
  const raw = localStorage.getItem('hoverPreviewDelay');
  const value = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(value) ? value : DEFAULT_DELAY;
}

const isTouch =
  typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

export default function useHoverPreview<T extends HTMLElement>(
  show: (e: React.MouseEvent<T>) => void,
  hide: () => void,
) {
  const timer = useRef<number | undefined>(undefined);

  const handleEnter = (e: React.MouseEvent<T>) => {
    if (isTouch) return;
    const delay = getDelay();
    timer.current = window.setTimeout(() => show(e), delay);
  };

  const handleLeave = () => {
    if (isTouch) return;
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = undefined;
    }
    hide();
  };

  return {
    onMouseEnter: handleEnter,
    onMouseLeave: handleLeave,
  };
}
