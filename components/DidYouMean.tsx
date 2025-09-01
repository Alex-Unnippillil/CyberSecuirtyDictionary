import React from 'react';

export interface DidYouMeanProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export default function DidYouMean({ suggestions, onSelect }: DidYouMeanProps) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="did-you-mean">
      {`Did you mean `}
      {suggestions.map((s, idx) => (
        <React.Fragment key={s}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelect(s);
            }}
          >
            {s}
          </a>
          {idx < suggestions.length - 1
            ? idx === suggestions.length - 2
              ? ' or '
              : ', '
            : '?'}
        </React.Fragment>
      ))}
    </div>
  );
}

