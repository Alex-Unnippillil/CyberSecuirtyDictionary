import React, { useState, useRef, useEffect } from 'react';
import AutocompleteList from './AutocompleteList';
import safeUrl from '../src/utils/safeUrl';

const SearchBox: React.FC = () => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    fetch(safeUrl(`/api/suggest?q=${encodeURIComponent(value)}`).toString())
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((data: string[]) => {
        setSuggestions(data);
        setHighlightedIndex(-1);
        setShowSuggestions(true);
      })
      .catch(() => {
        setSuggestions([]);
        setShowSuggestions(false);
      });
  }, [value]);

  const selectSuggestion = (suggestion: string) => {
    setValue(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev <= 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault();
        selectSuggestion(suggestions[highlightedIndex]);
      }
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 100);
  };

  return (
    <div className="search-box" style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      {showSuggestions && suggestions.length > 0 && (
        <AutocompleteList
          suggestions={suggestions}
          highlightedIndex={highlightedIndex}
          onSelect={selectSuggestion}
        />
      )}
    </div>
  );
};

export default SearchBox;
