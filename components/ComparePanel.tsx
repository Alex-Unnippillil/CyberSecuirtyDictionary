"use client";

import { useRouter } from "next/navigation";
import useRecentTerms from "../hooks/useRecentTerms";

function slugify(term: string) {
  return encodeURIComponent(term.toLowerCase().replace(/\s+/g, "-"));
}

/** Footer chip that offers comparison between two recently viewed terms. */
export default function ComparePanel() {
  const router = useRouter();
  const { pair, clear } = useRecentTerms();

  if (!pair) return null;

  const [a, b] = pair;

  const handleClick = () => {
    router.push(`/compare/${slugify(a)}-vs-${slugify(b)}`);
    clear();
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#eee",
        borderRadius: "9999px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      <button
        onClick={handleClick}
        style={{
          background: "none",
          border: "none",
          padding: "0.5rem 1rem",
          cursor: "pointer",
        }}
      >
        Compare {a} vs {b}
      </button>
    </div>
  );
}
