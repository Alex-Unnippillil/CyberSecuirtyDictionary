import React, { useMemo } from 'react';
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
  // Find overlapping highlights with different colours
  const overlaps = useMemo(() => {
    const res: Highlight[][] = [];
    for (let i = 0; i < highlights.length; i++) {
      for (let j = i + 1; j < highlights.length; j++) {
        const a = highlights[i];
        const b = highlights[j];
        if (
          a.elementId === b.elementId &&
          a.start !== undefined &&
          b.start !== undefined &&
          a.end !== undefined &&
          b.end !== undefined &&
          Math.max(a.start, b.start) < Math.min(a.end, b.end) &&
          a.color !== b.color
        ) {
          res.push([a, b]);
        }
      }
    }
    return res;
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
