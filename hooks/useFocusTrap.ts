import { useEffect, useRef } from "react";

/**
 * Trap keyboard focus within a container while active.
 * The container ref should be applied to the dialog element.
 */
export default function useFocusTrap(
  active: boolean,
  onEscape?: () => void,
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;

    const focusableSelectors = [
      "a[href]",
      "area[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "button:not([disabled])",
      "iframe",
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ];
    const focusable = Array.from(
      node.querySelectorAll<HTMLElement>(focusableSelectors.join(",")),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          (last || first)?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          (first || last)?.focus();
        }
      } else if (e.key === "Escape" && onEscape) {
        onEscape();
      }
    };

    node.addEventListener("keydown", handleKeyDown);
    first?.focus();

    return () => {
      node.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, onEscape]);

  return ref;
}
