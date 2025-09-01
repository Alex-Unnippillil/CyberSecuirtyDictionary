import React, { useState } from 'react';

export interface Collocation {
  term: string;
  count: number;
  examples: string[];
}

interface Props {
  collocations: Collocation[];
}

const Collocations: React.FC<Props> = ({ collocations }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (term: string) => {
    setExpanded(prev => ({ ...prev, [term]: !prev[term] }));
  };

  return (
    <div className="collocations">
      {collocations.map(({ term, count, examples }) => (
        <div key={term} className="collocation">
          <button className="chip" onClick={() => toggle(term)}>
            <span className="label">{term}</span>
            <span className="count">{count}</span>
          </button>
          {expanded[term] && (
            <ul className="examples">
              {examples.map((ex, i) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Collocations;
