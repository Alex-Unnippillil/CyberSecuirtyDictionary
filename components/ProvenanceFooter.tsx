import React from 'react';

export interface ProvenanceFooterProps {
  sources: string[];
  lastReviewed?: string;
}

/**
 * Renders provenance information for a term including source links
 * and the date the term was last reviewed.
 */
export const ProvenanceFooter: React.FC<ProvenanceFooterProps> = ({ sources, lastReviewed }) => {
  if ((!sources || sources.length === 0) && !lastReviewed) {
    return null;
  }

  return (
    <footer className="provenance-footer">
      {sources && sources.length > 0 && (
        <p>
          Sources:{' '}
          {sources.map((s, i) => (
            <React.Fragment key={s}>
              <a href={s} target="_blank" rel="noopener noreferrer">
                {s}
              </a>
              {i < sources.length - 1 ? ', ' : ''}
            </React.Fragment>
          ))}
        </p>
      )}
      {lastReviewed && <p>Last reviewed: {lastReviewed}</p>}
    </footer>
  );
};

export default ProvenanceFooter;
