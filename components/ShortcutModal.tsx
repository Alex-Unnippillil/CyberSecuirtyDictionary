import React, { useEffect, useRef, useState } from "react";

const focusableSelector =
  'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';

const ShortcutModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // global key listener for ? and esc
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.key === "?" || (e.key === "/" && e.shiftKey)) && !open) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // focus trap when modal is open
  useEffect(() => {
    if (!open || !modalRef.current) return;
    const focusable =
      modalRef.current.querySelectorAll<HTMLElement>(focusableSelector);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    function trap(e: KeyboardEvent) {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            (last || first).focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            (first || last).focus();
          }
        }
      }
    }
    document.addEventListener("keydown", trap);
    first?.focus();
    return () => document.removeEventListener("keydown", trap);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="shortcut-modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={() => setOpen(false)}
    >
      <div
        className="shortcut-modal"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Keyboard Shortcuts</h2>
        <ul>
          <li>
            <kbd>?</kbd> – Open this help dialog
          </li>
          <li>
            <kbd>/</kbd> – Focus search
          </li>
          <li>
            <kbd>↑</kbd>/<kbd>↓</kbd> – Navigate results
          </li>
          <li>
            <kbd>Esc</kbd> – Close dialog
          </li>
        </ul>
        <button onClick={() => setOpen(false)}>Close</button>
      </div>
    </div>
  );
};

export default ShortcutModal;
