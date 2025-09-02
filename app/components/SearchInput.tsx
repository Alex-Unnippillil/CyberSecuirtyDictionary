"use client";

import { useState } from "react";
import useSWR from "swr";

interface Term {
  term: string;
  definition: string;
}

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const { data: results = [] } = useSWR<Term[]>(
    query ? `/api/search?q=${encodeURIComponent(query)}` : null,
    { refreshInterval: 0 }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search terms..."
      />
      <ul>
        {results.map((item) => (
          <li key={item.term}>
            <strong>{item.term}:</strong> {item.definition}
          </li>
        ))}
      </ul>
    </div>
  );
}
