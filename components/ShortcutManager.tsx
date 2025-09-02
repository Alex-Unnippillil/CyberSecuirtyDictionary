import React, { useEffect, useState } from "react";

interface ShortcutManagerProps {
  /** The term this manager controls a shortcut for */
  term: string;
  /** Optional callback fired when a shortcut is triggered */
  onTrigger?: (term: string) => void;
}

interface TermHotkeys {
  [term: string]: string;
}

const STORAGE_KEY = "term-hotkeys";

function loadHotkeys(): TermHotkeys {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TermHotkeys) : {};
  } catch {
    return {};
  }
}

function saveHotkeys(hotkeys: TermHotkeys) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(hotkeys));
}

/**
 * ShortcutManager lets users assign custom hotkeys to specific terms. The
 * mappings persist in `localStorage`. Conflicts with existing shortcuts are
 * detected and can be resolved with one click.
 */
export default function ShortcutManager({ term, onTrigger }: ShortcutManagerProps) {
  const [hotkeys, setHotkeys] = useState<TermHotkeys>(() => loadHotkeys());
  const [currentKey, setCurrentKey] = useState(hotkeys[term] || "");
  const [conflict, setConflict] = useState<{ key: string; term: string } | null>(
    null,
  );

  useEffect(() => {
    saveHotkeys(hotkeys);
  }, [hotkeys]);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const key = e.key;
      const match = Object.entries(hotkeys).find(([, k]) => k === key);
      if (match) {
        e.preventDefault();
        onTrigger?.(match[0]);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hotkeys, onTrigger]);

  const assignKey = (key: string) => {
    const conflictEntry = Object.entries(hotkeys).find(
      ([t, k]) => k === key && t !== term,
    );
    if (conflictEntry) {
      setConflict({ key, term: conflictEntry[0] });
      return;
    }
    const next = { ...hotkeys, [term]: key };
    setHotkeys(next);
    setCurrentKey(key);
  };

  const removeKey = (targetTerm: string) => {
    const next = { ...hotkeys };
    delete next[targetTerm];
    setHotkeys(next);
    if (targetTerm === term) {
      setCurrentKey("");
    }
  };

  const handleInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    assignKey(e.key);
  };

  const resolveConflict = () => {
    if (conflict) {
      removeKey(conflict.term);
      assignKey(conflict.key);
      setConflict(null);
    }
  };

  return (
    <div className="shortcut-manager">
      <label htmlFor="shortcut-input">Shortcut</label>
      <input
        id="shortcut-input"
        type="text"
        value={currentKey}
        placeholder="Press a key"
        onKeyDown={handleInputKey}
        readOnly
      />
      {currentKey && (
        <button type="button" onClick={() => removeKey(term)}>
          Remove shortcut
        </button>
      )}
      {conflict && (
        <div className="shortcut-conflict">
          <span>
            Key "{conflict.key}" is assigned to {conflict.term}.
          </span>
          <button type="button" onClick={resolveConflict}>
            Replace
          </button>
        </div>
      )}
    </div>
  );
}

