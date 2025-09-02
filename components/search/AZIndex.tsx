"use client";

import { useEffect, useState } from "react";
import { loadStatuses } from "../../lib/understanding";

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
  const [statusFilter, setStatusFilter] = useState<
    "all" | "understood" | "notYet"
  >("all");
  const [statuses, setStatuses] = useState(loadStatuses());

  useEffect(() => {
    setStatuses(loadStatuses());
    const handler = () => setStatuses(loadStatuses());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  let filtered = filter
    ? terms.filter((t) => t.term.toUpperCase().startsWith(filter))
    : terms;

  if (statusFilter === "understood") {
    filtered = filtered.filter((t) => !!statuses[t.term]);
  } else if (statusFilter === "notYet") {
    filtered = filtered.filter((t) => !statuses[t.term]);
  }

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
      <nav className="status-filter">
        {[
          { key: "all", label: "All" },
          { key: "understood", label: "Understood" },
          { key: "notYet", label: "Not Yet" },
        ].map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setStatusFilter(opt.key as any)}
            className={statusFilter === opt.key ? "active" : ""}
            aria-pressed={statusFilter === opt.key}
          >
            {opt.label}
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

