import React from "react";
import { useRouter } from "next/navigation";

export interface RelatedTerm {
  /** Slug used to build link to the term page */
  slug: string;
  /** Human readable term name */
  name: string;
  /** Relative difficulty level, 1 (easy) to 5 (hard) */
  difficulty?: number;
}

interface RelatedTermsProps {
  /** Terms related to the current entry */
  relatedTerms?: RelatedTerm[];
}

/**
 * Displays a difficulty ladder of related terms for an entry.
 *
 * Each rung is color-coded by relative difficulty. Hovering a rung
 * reveals a button that navigates to the corresponding term page.
 * If no related terms are supplied, nothing is rendered.
 */
const RelatedTerms: React.FC<RelatedTermsProps> = ({ relatedTerms }) => {
  const router = useRouter();
  if (!relatedTerms || relatedTerms.length === 0) return null;

  const terms = [...relatedTerms].sort(
    (a, b) => (a.difficulty ?? 1) - (b.difficulty ?? 1),
  );

  const difficultyColor = (d: number = 1) => {
    const colors = ["#4ade80", "#a3e635", "#facc15", "#fb923c", "#ef4444"];
    return colors[Math.min(Math.max(d - 1, 0), colors.length - 1)];
  };

  return (
    <section className="related-terms">
      <h2 className="related-terms__heading">See also</h2>
      <ul className="related-terms__ladder">
        {terms.map((term) => (
          <li
            key={term.slug}
            className="related-terms__rung"
            style={{ background: difficultyColor(term.difficulty) }}
          >
            <button
              type="button"
              onClick={() => router.push(`/terms/${term.slug}`)}
              className="related-terms__link"
            >
              {term.name}
            </button>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .related-terms__ladder {
          display: flex;
          list-style: none;
          padding: 0;
          margin: 0;
          height: 1.5rem;
        }
        .related-terms__rung {
          flex: 1;
          position: relative;
        }
        .related-terms__link {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: #fff;
          opacity: 0;
          transition: opacity 0.2s ease-in-out;
          cursor: pointer;
        }
        .related-terms__rung:hover .related-terms__link,
        .related-terms__link:focus {
          opacity: 1;
          background: rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </section>
  );
};

export default RelatedTerms;
