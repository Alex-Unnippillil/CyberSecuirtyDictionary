import React, { useEffect, useState } from 'react';
import type { Highlight } from './HighlightsDrawer';

export interface HighlightResolverProps {
  /** All current highlights */
  highlights: Highlight[];
  /** Merge handler returning updated highlight collection */
  onMerge: (overlapping: Highlight[]) => Highlight[];
  /** Split handler returning updated highlight collection */
  onSplit: (overlapping: Highlight[]) => Highlight[];
}

/**
 * Detects overlapping highlight colours and provides controls to resolve them.
 * Dispatches a `highlight-change` event when a resolution occurs so other
 * components (like the drawer) can update immediately.
 */
export const HighlightResolver: React.FC<HighlightResolverProps> = ({
  highlights,
  onMerge,
  onSplit,
}) => {
  const [overlaps, setOverlaps] = useState<Highlight[][]>([]);

  // Heavy overlap detection can block the UI when many highlights are present.
  // Offload this work to a Web Worker so the main thread stays responsive.
  useEffect(() => {
    const worker = new Worker(new URL('./overlapWorker.ts', import.meta.url));
    worker.postMessage(highlights);
    worker.onmessage = (e) => {
      setOverlaps(e.data as Highlight[][]);
      worker.terminate();
    };
    return () => worker.terminate();
  }, [highlights]);

  if (overlaps.length === 0) return null;

  const resolve = (action: 'merge' | 'split') => {
    const flat = overlaps.flat();
    const unique = Array.from(new Map(flat.map((h) => [h.id, h])).values());
    const updated = action === 'merge' ? onMerge(unique) : onSplit(unique);
    window.dispatchEvent(
      new CustomEvent<Highlight[]>('highlight-change', { detail: updated }),
    );
  };

  return (
    <div className="highlight-resolver" role="alert">
      <button
        onClick={() => resolve('merge')}
        aria-label="Merge overlapping highlights"
      >
        Merge
      </button>
      <button
        onClick={() => resolve('split')}
        aria-label="Split overlapping highlights"
      >
        Split
      </button>
    </div>
  );
};

export default HighlightResolver;
