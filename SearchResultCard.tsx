import React, { useState } from "react";
import { safeParse } from "./src/utils/safeJson";

interface SearchResultCardProps {
  /** Term to display in the result */
  term: string;
  /** Short definition or snippet for the term */
  definition: string;
}

/**
 * Card displayed in search results. Includes a "+" button that adds the
 * term to a local collection and provides a toast with an undo option.
 */
export default function SearchResultCard({
  term,
  definition,
}: SearchResultCardProps) {
  const [toastVisible, setToastVisible] = useState(false);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const addToCollection = () => {
    const collection: string[] = safeParse(
      localStorage.getItem("collection"),
      [],
    );
    if (!collection.includes(term)) {
      collection.push(term);
      localStorage.setItem("collection", JSON.stringify(collection));
      setToastVisible(true);
      const t = setTimeout(() => setToastVisible(false), 4000);
      setTimer(t);
    }
  };

  const undo = () => {
    const collection: string[] = safeParse(
      localStorage.getItem("collection"),
      [],
    );
    const idx = collection.indexOf(term);
    if (idx !== -1) {
      collection.splice(idx, 1);
      localStorage.setItem("collection", JSON.stringify(collection));
    }
    if (timer) clearTimeout(timer);
    setToastVisible(false);
  };

  return (
    <div className="result-card">
      <h3>{term}</h3>
      <p>{definition}</p>
      <button
        onClick={addToCollection}
        aria-label="Add term to collection"
        type="button"
      >
        +
      </button>
      {toastVisible && (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#333",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            display: "flex",
            gap: "0.5rem",
            zIndex: 1000,
          }}
        >
          <span>Added to collection</span>
          <button
            onClick={undo}
            style={{ background: "transparent", color: "#fff", border: "none", textDecoration: "underline", cursor: "pointer" }}
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

