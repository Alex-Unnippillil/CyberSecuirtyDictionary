import React, { useState, useEffect, useRef, useMemo } from "react";
import { startGuidedTour } from "../features/tour/GuidedTour";
import useHotkeys from "../hooks/useHotkeys";

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
  const overlayRef = useRef<HTMLDivElement>(null);

  const hotkeys = useMemo(
    () => ({
      "shift+?": (e: KeyboardEvent) => {
        e.preventDefault();
        setOpen(true);
      },
      escape: () => setOpen(false),
    }),
    [],
  );

  useHotkeys("shortcut-cheatsheet", hotkeys);

  useEffect(() => {
    if (!open) return;
    const prevFocused = document.activeElement as HTMLElement;
    inputRef.current?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = overlayRef.current?.querySelectorAll<HTMLElement>(
        'input, button, [href], select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", trap);
      prevFocused?.focus();
    };
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
        <button
          onClick={() => {
            setOpen(false);
            startGuidedTour();
          }}
        >
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
