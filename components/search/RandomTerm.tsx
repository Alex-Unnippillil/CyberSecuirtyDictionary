import React, { useEffect, useRef, useState } from 'react';

type Term = {
  term?: string;
  name?: string;
};

/**
 * Renders a button that navigates the user to a random term from `terms.json`.
 */
const RandomTerm: React.FC = () => {
  const [terms, setTerms] = useState<Term[]>([]);

  const hasFetchedRef = useRef(false);
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetch('/terms.json')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.terms || [];
        setTerms(list);
      })
      .catch(() => setTerms([]));
  }, []);

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

