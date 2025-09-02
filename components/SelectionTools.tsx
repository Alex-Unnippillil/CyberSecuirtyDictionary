import React, { useEffect, useRef, useState } from 'react';

interface Position {
  top: number;
  left: number;
}

const MARGIN = 8;

const SelectionTools: React.FC = () => {
  const [pos, setPos] = useState<Position | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        setPos(null);
        return;
      }
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const toolbar = ref.current;
      const width = toolbar?.offsetWidth || 200;
      const height = toolbar?.offsetHeight || 40;
      let left = rect.left + rect.width / 2 - width / 2;
      let top = rect.top - height - MARGIN;
      if (left < MARGIN) left = MARGIN;
      if (left + width > window.innerWidth - MARGIN) left = window.innerWidth - width - MARGIN;
      if (top < MARGIN) top = rect.bottom + MARGIN;
      setPos({ top, left });
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPos(null);
    };

    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setPos(null);
      }
    };

    document.addEventListener('mouseup', updatePosition);
    document.addEventListener('keyup', updatePosition);
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mouseup', updatePosition);
      document.removeEventListener('keyup', updatePosition);
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  if (!pos) return null;

  const copy = () => {
    const text = window.getSelection()?.toString() || '';
    navigator.clipboard?.writeText(text);
    setPos(null);
  };

  const highlight = () => {
    // Placeholder for highlight functionality
    setPos(null);
  };

  const define = () => {
    // Placeholder for define functionality
    setPos(null);
  };

  const addToNotes = () => {
    // Placeholder for notes functionality
    setPos(null);
  };

  return (
    <div ref={ref} className="selection-tools" style={{ top: pos.top, left: pos.left }}>
      <button onClick={copy}>Copy</button>
      <button onClick={highlight}>Highlight</button>
      <button onClick={define}>Define</button>
      <button onClick={addToNotes}>Add to Notes</button>
    </div>
  );
};

export default SelectionTools;
