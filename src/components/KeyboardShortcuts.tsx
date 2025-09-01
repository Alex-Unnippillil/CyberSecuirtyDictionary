import React, { useEffect, useState } from "react";

/**
 * KeyboardShortcuts listens for the `?` key and displays a help overlay
 * describing available keyboard commands. Press `Escape` to close.
 */
export const KeyboardShortcuts: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if ((key === "?" || (key === "/" && e.shiftKey)) && !open) {
        e.preventDefault();
        setOpen(true);
      } else if (key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  if (!open) return null;

  return (
    <div className="keyboard-shortcuts-overlay" onClick={() => setOpen(false)}>
      <div
        className="keyboard-shortcuts-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Keyboard Shortcuts</h2>
        <ul>
          <li>
            <kbd>?</kbd> Open shortcuts
          </li>
          <li>
            <kbd>Esc</kbd> Close
          </li>
          <li>
            <kbd>/</kbd> Focus search
          </li>
        </ul>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
