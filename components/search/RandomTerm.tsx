import React from 'react';
import useSWR from 'swr';

type Term = {
  term?: string;
  name?: string;
};

/**
 * Renders a button that navigates the user to a random term from `terms.json`.
 */
const RandomTerm: React.FC = () => {
  const { data } = useSWR<Term[] | { terms: Term[] }>(
    '/terms.json',
    { refreshInterval: 86400000 }
  );
  const terms = Array.isArray(data) ? data : data?.terms || [];

  const handleClick = () => {
    if (!terms.length) return;
    const random = terms[Math.floor(Math.random() * terms.length)];
    const name = random.term || random.name || '';
    if (name) {
      window.location.href = `#${encodeURIComponent(name)}`;
    }
  };

  return (
    <button type="button" onClick={handleClick} aria-label="Random term">
      Random Term
    </button>
  );
};

export default RandomTerm;

