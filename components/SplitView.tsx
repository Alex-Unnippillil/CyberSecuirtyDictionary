import React, { useEffect, useRef, useState } from 'react';

interface SplitViewProps {
  children: [React.ReactNode, React.ReactNode];
  /** initial size of the first pane as percentage */
  initial?: number;
  /** minimum size of either pane as percentage */
  min?: number;
  /** layout orientation */
  orientation?: 'horizontal' | 'vertical';
  /** keyboard step percentage */
  step?: number;
}

/**
 * SplitView renders two panes separated by a draggable divider.
 * Alt+Arrow keys adjust the divider and sizes are announced via aria-live.
 */
const SplitView: React.FC<SplitViewProps> = ({
  children,
  initial = 50,
  min = 10,
  orientation = 'horizontal',
  step = 5
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(initial); // percentage for first pane
  const horizontal = orientation === 'horizontal';

  const updateLive = (next: number): void => {
    if (!liveRef.current) return;
    const first = Math.round(next);
    const second = Math.round(100 - next);
    liveRef.current.textContent = `Pane sizes ${first} and ${second} percent`;
  };

  useEffect(() => {
    updateLive(pos);
  }, [pos]);

  const startDrag = (e: React.PointerEvent): void => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const size = horizontal ? rect.width : rect.height;

    const move = (ev: PointerEvent): void => {
      const offset = horizontal ? ev.clientX - rect.left : ev.clientY - rect.top;
      let pct = (offset / size) * 100;
      pct = Math.min(100 - min, Math.max(min, pct));
      setPos(pct);
    };

    const stop = (): void => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', stop);
    };

    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', stop);
  };

  const onKeyDown = (e: React.KeyboardEvent): void => {
    if (!e.altKey) return;
    let delta = 0;
    if (horizontal) {
      if (e.key === 'ArrowLeft') delta = -step;
      else if (e.key === 'ArrowRight') delta = step;
    } else {
      if (e.key === 'ArrowUp') delta = -step;
      else if (e.key === 'ArrowDown') delta = step;
    }
    if (!delta) return;
    e.preventDefault();
    let next = pos + delta;
    next = Math.min(100 - min, Math.max(min, next));
    setPos(next);
  };

  return (
    <div ref={containerRef} className={`split-view ${orientation}`}>
      <div
        className="split-pane"
        style={horizontal ? { width: `${pos}%` } : { height: `${pos}%` }}
      >
        {children[0]}
      </div>
      <div
        className="split-handle"
        role="separator"
        tabIndex={0}
        aria-orientation={orientation}
        onPointerDown={startDrag}
        onKeyDown={onKeyDown}
      />
      <div
        className="split-pane"
        style={horizontal ? { width: `${100 - pos}%` } : { height: `${100 - pos}%` }}
      >
        {children[1]}
      </div>
      <div aria-live="polite" className="sr-only" ref={liveRef} />
    </div>
  );
};

export default SplitView;

