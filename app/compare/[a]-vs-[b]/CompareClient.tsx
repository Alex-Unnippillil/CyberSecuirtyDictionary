"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

export type Term = { term: string; definition: string };

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

export default function CompareClient({
  termA,
  termB,
}: {
  termA: Term;
  termB: Term;
}) {
  const search = useSearchParams();
  const router = useRouter();

  const [showDiff, setShowDiff] = useState(search.get("diff") === "1");
  const [showSame, setShowSame] = useState(search.get("same") === "1");

  useEffect(() => {
    const sp = new URLSearchParams(Array.from(search.entries()));
    showDiff ? sp.set("diff", "1") : sp.delete("diff");
    showSame ? sp.set("same", "1") : sp.delete("same");
    router.replace(`?${sp.toString()}`, { scroll: false });
  }, [showDiff, showSame, router, search]);

  return (
    <div>
      <h1>
        Compare {termA.term} vs {termB.term}
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
          <h2>{termA.term}</h2>
          <p>
            {highlight(termA.definition, termB.definition, showDiff, showSame)}
          </p>
        </div>
        <div>
          <h2>{termB.term}</h2>
          <p>
            {highlight(termB.definition, termA.definition, showDiff, showSame)}
          </p>
        </div>
      </div>
    </div>
  );
}
