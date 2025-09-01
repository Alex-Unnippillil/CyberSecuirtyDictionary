import React, { useEffect, useState, ChangeEvent } from 'react';

declare global {
  interface Window {
    __handleSearch?: () => void;
  }
}

const AdvancedFilters: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const initial = parseInt(params.get('difficulty') || '0', 10);
  const [difficulty, setDifficulty] = useState(initial);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (difficulty > 0) {
      searchParams.set('difficulty', difficulty.toString());
    } else {
      searchParams.delete('difficulty');
    }
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
    if (typeof window.__handleSearch === 'function') {
      window.__handleSearch();
    }
  }, [difficulty]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDifficulty(parseInt(e.target.value, 10));
  };

  return (
    <div className="advanced-filters">
      <label htmlFor="difficulty">Difficulty: {difficulty}</label>
      <input
        id="difficulty"
        type="range"
        min="0"
        max="5"
        value={difficulty}
        onChange={handleChange}
      />
    </div>
  );
};

export default AdvancedFilters;
