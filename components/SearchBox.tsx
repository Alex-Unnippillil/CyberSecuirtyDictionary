import React, { useState, useEffect } from 'react';

/**
 * SearchBox component with fuzzy search toggle. The toggle state is persisted
 * to the URL query string as `fuzzy=true|false` so that the setting can be
 * shared or refreshed without losing state.
 */
export default function SearchBox() {
  // Initialise fuzzy state from current query string
  const initialParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const [fuzzy, setFuzzy] = useState(initialParams.get('fuzzy') === 'true');

  // Persist fuzzy state to the query string whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (fuzzy) {
      params.set('fuzzy', 'true');
    } else {
      params.set('fuzzy', 'false');
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [fuzzy]);

  return (
    <div className="search-box">
      <input id="search-box" type="text" />
      <button
        type="button"
        onClick={() => setFuzzy((prev) => !prev)}
        aria-pressed={fuzzy}
      >
        {fuzzy ? 'Disable fuzzy' : 'Enable fuzzy'}
      </button>
    </div>
  );
}

