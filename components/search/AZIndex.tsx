"use client";

import { useState } from "react";

interface Term {
  term: string;
  definition: string;
}

interface Props {
  terms: Term[];
}

const letters = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

export default function AZIndex({ terms }: Props) {
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = filter
    ? terms.filter((t) => t.term.toUpperCase().startsWith(filter))
    : terms;

  return (
    <div>
      <nav className="az-index">
        {letters.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setFilter(l)}
            className={filter === l ? "active" : ""}
            aria-pressed={filter === l}
          >
            {l}
          </button>
        ))}
      </nav>
      <ul className="term-list">
        {filtered.map((t) => (
          <li key={t.term}>
            <strong>{t.term}</strong>: {t.definition}
          </li>
        ))}
      </ul>
    </div>
  );
}

