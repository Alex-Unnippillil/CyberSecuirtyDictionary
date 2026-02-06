import type { Highlight } from './HighlightsDrawer';

self.onmessage = (e: MessageEvent<Highlight[]>) => {
  const highlights = e.data;
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
  (self as DedicatedWorkerGlobalScope).postMessage(res);
};

export {};
