"use client";

import { useState } from "react";
import { searchPersonalTerms, PersonalTerm } from "../../lib/personalTerms";
import useOffline from "../../src/hooks/useOffline";

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
  const [personal, setPersonal] = useState<PersonalTerm[]>([]);
  const offline = useOffline();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (offline) {
      setResults([]);
      setPersonal([]);
      return;
    }

    const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
    if (res.ok) {
      const data: SearchResponse = await res.json();
      setResults(data.results);
    } else {
      setResults([]);
    }
    const p = await searchPersonalTerms(value);
    setPersonal(p);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search terms..."
        disabled={offline}
      />
      {offline && (
        <p className="text-red-600 text-sm">Search unavailable offline</p>
      )}
      <ul>
        {[
          ...personal.map((p) => ({
            term: p.slug,
            definition: p.definition,
            personal: true,
          })),
          ...results.map((r) => ({ ...r, personal: false })),
        ].map((item) => (
          <li key={item.term}>
            <strong>{item.term}</strong>
            {item.personal && <span className="badge"> Personal</span>}:{" "}
            {item.definition}
          </li>
        ))}
      </ul>
    </div>
  );
}
