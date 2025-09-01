import React from 'react';

interface AutocompleteListProps {
  suggestions: string[];
  highlightedIndex: number;
  onSelect: (value: string) => void;
}

const AutocompleteList: React.FC<AutocompleteListProps> = ({
  suggestions,
  highlightedIndex,
  onSelect,
}) => {
  return (
    <ul className="autocomplete-list">
      {suggestions.map((suggestion, index) => (
        <li
          key={`${suggestion}-${index}`}
          className={index === highlightedIndex ? 'highlighted' : undefined}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(suggestion);
          }}
        >
          {suggestion}
        </li>
      ))}
    </ul>
  );
};

export default AutocompleteList;
