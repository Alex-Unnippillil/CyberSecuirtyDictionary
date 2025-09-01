import React, { useState, useEffect, useRef } from 'react';

interface AutocompleteProps {
  /**
   * Called when a suggestion is committed via selection or pressing Enter.
   */
  onCommit?: (value: string) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ onCommit }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const controller = new AbortController();
    fetch(`/api/suggestions?q=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: string[]) => {
        setSuggestions(data);
        setOpen(true);
        setActiveIndex(-1);
      })
      .catch(() => {
        /* ignore network errors */
      });

    return () => controller.abort();
  }, [query]);

  const commit = (value: string) => {
    setQuery(value);
    setOpen(false);
    setActiveIndex(-1);
    onCommit?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && e.key === 'ArrowDown' && suggestions.length) {
      setOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      commit(suggestions[activeIndex]);
    }
  };

  const handleBlur = () => {
    // Delay closing to allow click events to register
    setTimeout(() => setOpen(false), 100);
  };

  return (
    <div className="autocomplete">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      {open && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s, i) => (
            <li
              key={s + i}
              className={i === activeIndex ? 'active' : ''}
              onMouseDown={() => commit(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;

