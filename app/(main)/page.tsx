"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/SearchBar";
import TermCard, { Term } from "../../components/TermCard";
import EmptyState from "../../components/EmptyState";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Main landing page with a search bar and results list. Supports keyboard
 * navigation with arrow keys and Enter to open the selected term.
 */
export default function HomePage() {
  const [query, setQuery] = useState("");
  const [terms, setTerms] = useState<Term[]>([]);
  const [active, setActive] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetch("/terms.json")
      .then((r) => r.json())
      .then((data) => {
        const mapped: Term[] = data.terms.map((t: any) => ({
          slug: slugify(t.term),
          title: t.term,
          description: t.definition,
        }));
        setTerms(mapped);
      });
  }, []);

  const results = terms.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase()),
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      router.push(`/term/${results[active].slug}`);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <SearchBar value={query} onChange={setQuery} onKeyDown={handleKeyDown} />
      <div className="mt-4">
        {results.length === 0 && query ? (
          <EmptyState message="No matching terms" />
        ) : (
          results.map((term, idx) => (
            <TermCard key={term.slug} term={term} selected={idx === active} />
          ))
        )}
      </div>
    </div>
  );
}
