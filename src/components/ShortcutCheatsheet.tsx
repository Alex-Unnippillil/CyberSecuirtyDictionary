import React, { useState, useEffect, useRef } from "react";
import { startGuidedTour } from "../features/tour/GuidedTour";
import useFocusTrap from "../../hooks/useFocusTrap";

interface Shortcut {
  keys: string;
  description: string;
}

const SHORTCUTS: Shortcut[] = [
  { keys: "Shift+/", description: "Open shortcut help" },
  { keys: "Ctrl+F", description: "Search" },
  { keys: "Esc", description: "Close overlay" },
];

export default function ShortcutCheatsheet() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useFocusTrap(open, () => setOpen(false));
  const prevFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function handleGlobalKey(e: KeyboardEvent) {
      if (e.key === "?" && e.shiftKey) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, []);

  useEffect(() => {
    if (open) {
      prevFocused.current = document.activeElement as HTMLElement;
      inputRef.current?.focus();
    } else if (prevFocused.current) {
      prevFocused.current.focus();
    }
  }, [open]);

  const shortcuts = SHORTCUTS.filter(
    (s) =>
      s.keys.toLowerCase().includes(filter.toLowerCase()) ||
      s.description.toLowerCase().includes(filter.toLowerCase()),
  );

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="shortcut-cheatsheet-overlay"
      ref={overlayRef}
      tabIndex={-1}
    >
      <div className="shortcut-cheatsheet">
        <button onClick={() => setOpen(false)} aria-label="Close">
          ×
        </button>
        <input
          type="text"
          placeholder="Filter shortcuts"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          ref={inputRef}
        />
        <button onClick={() => { setOpen(false); startGuidedTour(); }}>
          Replay tour
        </button>
        <ul>
          {shortcuts.map((s) => (
            <li key={s.keys}>
              <kbd>{s.keys}</kbd> - {s.description}
            </li>
          ))}
          {shortcuts.length === 0 && <li>No shortcuts</li>}
        </ul>
      </div>
    </div>
  );
}
