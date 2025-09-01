import React, { useEffect, useState } from 'react';

interface Shortcut {
  keys: string;
  description: string;
}

const shortcuts: Shortcut[] = [
  { keys: '/', description: 'Focus search' },
  { keys: 'ArrowDown / j', description: 'Next entry' },
  { keys: 'ArrowUp / k', description: 'Previous entry' },
  { keys: '?', description: 'Toggle shortcuts help' },
];

/**
 * ShortcutPalette listens for the `?` key and displays a modal with
 * documented keyboard shortcuts. Press `Esc` to close the palette.
 */
export default function ShortcutPalette(): JSX.Element | null {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // ignore if typing in an input/textarea or content editable area
      const target = e.target as HTMLElement;
      const isTypingTarget = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      );
      if (!isTypingTarget && e.key === '?') {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    }

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!open) return null;

  return (
    <div className="shortcut-palette" role="dialog" aria-modal="true">
      <div className="shortcut-palette__content">
        <h2>Keyboard Shortcuts</h2>
        <ul>
          {shortcuts.map(({ keys, description }) => (
            <li key={description}>
              <kbd>{keys}</kbd> — {description}
            </li>
          ))}
        </ul>
        <p>Press <kbd>Esc</kbd> to close.</p>
      </div>
    </div>
  );
}
