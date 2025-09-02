import React from "react";
import { useRouter } from "next/navigation";
import relatedReasons from "../../relatedReasons.json";

export interface RelatedTerm {
  /** Slug used to build link to the term page */
  slug: string;
  /** Human readable term name */
  name: string;
}

interface RelatedTermsProps {
  /** Terms related to the current entry */
  relatedTerms?: RelatedTerm[];
}

/**
 * Displays a list of related terms for an entry.
 *
 * Related terms are rendered as pill-shaped links that lead to
 * their respective term pages. If no related terms are supplied,
 * nothing is rendered.
 */
const RelatedTerms: React.FC<RelatedTermsProps> = ({ relatedTerms }) => {
  const router = useRouter();
  if (!relatedTerms || relatedTerms.length === 0) return null;

  return (
    <section className="related-terms">
      <h2 className="related-terms__heading">See also</h2>
      <ul className="related-terms__list">
        {relatedTerms.map((term) => {
          const reason = (relatedReasons as Record<string, string>)[term.slug];
          return (
            <li key={term.slug} className="related-terms__item">
              <button
                type="button"
                onClick={() => router.push(`/terms/${term.slug}`)}
                className="related-terms__pill"
                title={reason || undefined}
                aria-label={reason ? `${term.name} – ${reason}` : term.name}
              >
                <span className="related-terms__term">{term.name}</span>
                {reason && (
                  <span
                    aria-hidden="true"
                    className="related-terms__reason"
                  >
                    {reason}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default RelatedTerms;
