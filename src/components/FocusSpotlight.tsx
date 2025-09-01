import React, { useEffect, useState } from 'react';

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * FocusSpotlight renders an overlay that dims everything except the currently
 * focused section. The overlay tracks focus changes and updates its position
 * accordingly. If the user prefers reduced motion, transitions are disabled.
 */
export default function FocusSpotlight() {
  const [rect, setRect] = useState<Rect | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);

  // Listen for prefers-reduced-motion and update state
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  // Track focus changes to highlight the focused section
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      const section = target.closest('section') as HTMLElement | null;
      setActiveElement(section);
    };
    document.addEventListener('focusin', handleFocus);
    return () => document.removeEventListener('focusin', handleFocus);
  }, []);

  // Update rect on scroll/resize when an element is active
  useEffect(() => {
    if (!activeElement) {
      setRect(null);
      return;
    }

    const updateRect = () => {
      const r = activeElement.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [activeElement]);

  if (!rect) return null;

  const baseStyle: React.CSSProperties = {
    position: 'fixed',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    pointerEvents: 'none',
  };

  if (!reducedMotion) {
    baseStyle.transition = 'all 0.2s ease';
  }

  return (
    <>
      {/* Top overlay */}
      <div
        style={{
          ...baseStyle,
          top: 0,
          left: 0,
          width: '100%',
          height: Math.max(0, rect.top),
        }}
      />
      {/* Left overlay */}
      <div
        style={{
          ...baseStyle,
          top: rect.top,
          left: 0,
          width: Math.max(0, rect.left),
          height: rect.height,
        }}
      />
      {/* Right overlay */}
      <div
        style={{
          ...baseStyle,
          top: rect.top,
          left: rect.left + rect.width,
          width: `calc(100% - ${rect.left + rect.width}px)`,
          height: rect.height,
        }}
      />
      {/* Bottom overlay */}
      <div
        style={{
          ...baseStyle,
          top: rect.top + rect.height,
          left: 0,
          width: '100%',
          height: `calc(100% - ${rect.top + rect.height}px)`,
        }}
      />
    </>
  );
}
