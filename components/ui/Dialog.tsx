import React, { useEffect, useRef } from "react";
import useFocusTrap from "../../hooks/useFocusTrap";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onClose, children }) => {
  const dialogRef = useFocusTrap(open, onClose);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
    } else if (previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" ref={dialogRef} tabIndex={-1}>
      {children}
    </div>
  );
};

export default Dialog;
