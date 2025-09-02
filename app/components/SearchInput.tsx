"use client";

import { useState } from "react";

interface Term {
  term: string;
  definition: string;
}

interface SearchResponse {
  results: Term[];
  suggestions: string[];
}

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Term[]>([]);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setQuery(value);

    const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
    if (res.ok) {
      const data: SearchResponse = await res.json();
      setResults(data.results);
    } else {
      setResults([]);
    }
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
