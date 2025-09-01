"use client";
import React from "react";
import Link from "next/link";

export interface Term {
  slug: string;
  title: string;
  description?: string;
}

interface TermCardProps {
  term: Term;
  selected?: boolean;
}

/**
 * Displays a single term in search results or grids.
 */
export function TermCard({ term, selected }: TermCardProps) {
  return (
    <Link
      href={`/term/${term.slug}`}
      className={`block border rounded p-4 mb-2 no-underline hover:bg-gray-100 ${selected ? "bg-gray-100" : ""}`}
    >
      <h3 className="font-semibold">{term.title}</h3>
      {term.description && (
        <p className="text-sm text-gray-600">{term.description}</p>
      )}
    </Link>
  );
}

export default TermCard;
