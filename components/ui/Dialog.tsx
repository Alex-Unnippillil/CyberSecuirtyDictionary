import React, { useEffect, useRef } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const focusableSelectors =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export const Dialog: React.FC<DialogProps> = ({ open, onClose, children }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      const firstFocusable =
        dialogRef.current?.querySelector<HTMLElement>(focusableSelectors);
      firstFocusable?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Tab" && dialogRef.current) {
          const focusable =
            dialogRef.current.querySelectorAll<HTMLElement>(focusableSelectors);
          if (!focusable.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          } else if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        }
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    } else if (previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus();
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" ref={dialogRef}>
      {children}
    </div>
  );
};

export default Dialog;
