import { useEffect, useRef, useState } from 'react';

/**
 * useEndOfContent detects when the user has scrolled to the end of the
 * provided element. A ref to a sentinel element is returned which should be
 * placed at the end of the content. When the sentinel enters the viewport the
 * hook marks the content as finished and invokes the optional callback.
 */
export default function useEndOfContent<T extends HTMLElement>(
  onEnd?: () => void,
) {
  const endRef = useRef<T>(null);
  const [reachedEnd, setReachedEnd] = useState(false);

  useEffect(() => {
    const target = endRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReachedEnd(true);
          onEnd?.();
        }
      },
      { threshold: 1.0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [onEnd]);

  return { endRef, reachedEnd };
}
