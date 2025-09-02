import React from "react";
import { useRouter } from "next/navigation";

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
        {relatedTerms.map((term) => (
          <li key={term.slug} className="related-terms__item">
            <button
              type="button"
              onClick={() => router.push(`/terms/${term.slug}`)}
              className="related-terms__pill"
            >
              {term.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RelatedTerms;
