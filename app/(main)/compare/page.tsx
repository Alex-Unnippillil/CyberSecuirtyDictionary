"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "../../../components/SearchBar";
import TermCard, { Term } from "../../../components/TermCard";
import EmptyState from "../../../components/EmptyState";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ComparePage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

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

  const leftTerm = terms.find(
    (t) => t.title.toLowerCase() === left.toLowerCase(),
  );
  const rightTerm = terms.find(
    (t) => t.title.toLowerCase() === right.toLowerCase(),
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Compare Terms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <SearchBar value={left} onChange={setLeft} placeholder="First term" />
          {leftTerm ? (
            <TermCard term={leftTerm} />
          ) : (
            <EmptyState message="Select a term" />
          )}
        </div>
        <div>
          <SearchBar
            value={right}
            onChange={setRight}
            placeholder="Second term"
          />
          {rightTerm ? (
            <TermCard term={rightTerm} />
          ) : (
            <EmptyState message="Select a term" />
          )}
        </div>
      </div>
    </div>
  );
}
