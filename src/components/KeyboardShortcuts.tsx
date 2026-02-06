import React, { useMemo, useState } from "react";
import useHotkeys from "../hooks/useHotkeys";

/**
 * KeyboardShortcuts listens for the `?` key and displays a help overlay
 * describing available keyboard commands. Press `Escape` to close.
 */
export const KeyboardShortcuts: React.FC = () => {
  const [open, setOpen] = useState(false);

  const hotkeys = useMemo(
    () => ({
      "shift+?": (e: KeyboardEvent) => {
        e.preventDefault();
        setOpen(true);
      },
      "shift+/": (e: KeyboardEvent) => {
        e.preventDefault();
        setOpen(true);
      },
      escape: () => setOpen(false),
    }),
    [],
  );

  useHotkeys("keyboard-shortcuts", hotkeys);

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
