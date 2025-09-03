import { useEffect, useRef } from 'react';
import { useSelection } from './SelectionContext';

interface Item { id: string; rect: DOMRect }

export function useMarquee(
  container: HTMLElement | null,
  getItems: () => Item[]
): void {
  const { marqueeSelect } = useSelection();
  const startRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!container) return;

    function onMouseDown(e: MouseEvent) {
      if (e.button !== 0) return;
      startRef.current = { x: e.clientX, y: e.clientY };
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(e: MouseEvent) {
      const start = startRef.current;
      if (!start) return;
      const x1 = Math.min(start.x, e.clientX);
      const y1 = Math.min(start.y, e.clientY);
      const x2 = Math.max(start.x, e.clientX);
      const y2 = Math.max(start.y, e.clientY);
      const hits = getItems()
        .filter(({ rect }) => rect.left < x2 && rect.right > x1 && rect.top < y2 && rect.bottom > y1)
        .map(i => i.id);
      marqueeSelect(hits);
    }

    function onMouseUp() {
      startRef.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    container.addEventListener('mousedown', onMouseDown);
    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [container, marqueeSelect, getItems]);
}
