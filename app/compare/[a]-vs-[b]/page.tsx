"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import styles from "./page.module.css";
import termsData from "../../../terms.json";

type Term = { term: string; definition: string };

type Params = { a: string; b: string };

function findTerm(slug: string): Term | undefined {
  const normalized = decodeURIComponent(slug).replace(/-/g, " ").toLowerCase();
  return termsData.terms.find((t: Term) => t.term.toLowerCase() === normalized);
}

function highlight(
  def: string,
  other: string,
  showDiff: boolean,
  showSame: boolean,
) {
  const words = def.split(/(\s+)/);
  const otherSet = new Set(other.toLowerCase().split(/\s+/));
  return words.map((w, i) => {
    const lw = w.toLowerCase();
    const isWord = /\w/.test(w);
    const isDiff = showDiff && isWord && !otherSet.has(lw);
    const isSame = showSame && isWord && otherSet.has(lw);
    const className = isDiff
      ? `${styles.callout} ${styles.diff}`
      : isSame
        ? `${styles.callout} ${styles.same}`
        : undefined;
    return (
      <span key={i} className={className}>
        {w}
      </span>
    );
  });
}

export default function ComparePage({ params }: { params: Params }) {
  const { a, b } = params;
  const search = useSearchParams();
  const router = useRouter();

  const [showDiff, setShowDiff] = useState(search.get("diff") === "1");
  const [showSame, setShowSame] = useState(search.get("same") === "1");

  useEffect(() => {
    const sp = new URLSearchParams(Array.from(search.entries()));
    showDiff ? sp.set("diff", "1") : sp.delete("diff");
    showSame ? sp.set("same", "1") : sp.delete("same");
    router.replace(`?${sp.toString()}`, { scroll: false });
  }, [showDiff, showSame, router]);

  const termA = useMemo(() => findTerm(a), [a]);
  const termB = useMemo(() => findTerm(b), [b]);

  const defA = termA?.definition || "Term not found.";
  const defB = termB?.definition || "Term not found.";

  return (
    <div className="min-h-screen bg-white p-4 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="mb-4 text-3xl font-bold">
        Compare {termA?.term || a} vs {termB?.term || b}
      </h1>
      <div className={styles.controls}>
        <label>
          <input
            type="checkbox"
            checked={showDiff}
            onChange={() => setShowDiff((d) => !d)}
          />
          Highlight differences
        </label>
        <label>
          <input
            type="checkbox"
            checked={showSame}
            onChange={() => setShowSame((s) => !s)}
          />
          Highlight similarities
        </label>
      </div>
      <div className={styles.compareGrid}>
        <div>
          <h2 className="mb-2 text-2xl font-semibold">{termA?.term || a}</h2>
          <p className="text-gray-700 dark:text-gray-300">
            {highlight(defA, defB, showDiff, showSame)}
          </p>
        </div>
        <div>
          <h2 className="mb-2 text-2xl font-semibold">{termB?.term || b}</h2>
          <p className="text-gray-700 dark:text-gray-300">
            {highlight(defB, defA, showDiff, showSame)}
          </p>
        </div>
      </div>
    </div>
  );
}
