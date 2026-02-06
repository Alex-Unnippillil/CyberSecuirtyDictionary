import React, { useEffect, useRef } from "react";
import useFocusTrap from "../hooks/useFocusTrap";

interface ModalProps {
  /** Controls whether the modal is visible */
  isOpen: boolean;
  /** Called when the modal requests to be closed */
  onClose: () => void;
  /** Modal content */
  children: React.ReactNode;
  /** Optional id for the dialog element */
  id?: string;
  /** Accessible label id */
  labelledBy?: string;
  /** Accessible description id */
  describedBy?: string;
  /** Optional tooltip to describe the trigger */
  tooltip?: string;
  /** Id for the tooltip element */
  tooltipId?: string;
}

/**
 * Accessible modal dialog that traps focus while open and
 * restores focus to the trigger element on close. If a tooltip is
 * provided, it is connected to the trigger via `aria-describedby`.
 */
export default function Modal({
  isOpen,
  onClose,
  children,
  id = "modal",
  labelledBy,
  describedBy,
  tooltip,
  tooltipId = id + "-tooltip",
}: ModalProps) {
  const dialogRef = useFocusTrap(isOpen, onClose);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Remember the element that triggered the modal
    triggerRef.current = document.activeElement as HTMLElement;

    // Optionally wire tooltip to the trigger
    if (tooltip && triggerRef.current) {
      triggerRef.current.setAttribute("aria-describedby", tooltipId);
    }

    return () => {
      // Clean up tooltip wiring
      if (tooltip && triggerRef.current) {
        triggerRef.current.removeAttribute("aria-describedby");
      }

      // Restore focus to the trigger
      triggerRef.current?.focus();
    };
  }, [isOpen, tooltip, tooltipId]);

  if (!isOpen) return null;

  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      ref={dialogRef}
      tabIndex={-1}
    >
      {tooltip && (
        <div role="tooltip" id={tooltipId}>
          {tooltip}
        </div>
      )}
      {children}
    </div>
  );
}
