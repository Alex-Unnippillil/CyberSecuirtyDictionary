import Link from "next/link";
import { allTerms } from "contentlayer/generated";

interface RelatedTermsProps {
  slugs?: string[];
}

interface LadderTerm {
  slug: string;
  title: string;
  difficulty: number;
}

/**
 * Renders related terms as a horizontal ladder. Each rung is shaded by
 * difficulty so readers can gauge prerequisite knowledge at a glance.
 */
export default function RelatedTerms({ slugs }: RelatedTermsProps) {
  if (!slugs || slugs.length === 0) return null;

  const terms: LadderTerm[] = slugs
    .map((slug) => {
      const term = allTerms.find((t) => t.slug === slug);
      return {
        slug,
        title: term?.title ?? slug,
        difficulty: (term as any)?.difficulty ?? 1,
      };
    })
    .sort((a, b) => a.difficulty - b.difficulty);

  const difficultyColor = (d: number) => {
    const colors = ["#4ade80", "#a3e635", "#facc15", "#fb923c", "#ef4444"];
    return colors[Math.min(Math.max(d - 1, 0), colors.length - 1)];
  };

  return (
    <section aria-labelledby="related-terms-heading">
      <h2 id="related-terms-heading">Related Terms</h2>
      <ul className="ladder">
        {terms.map((t) => (
          <li
            key={t.slug}
            className="rung"
            style={{ background: difficultyColor(t.difficulty) }}
          >
            <Link href={`/term/${t.slug}`} className="rung__link">
              {t.title}
            </Link>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .ladder {
          display: flex;
          list-style: none;
          padding: 0;
          margin: 0;
          height: 1.5rem;
        }
        .rung {
          flex: 1;
          position: relative;
        }
        .rung__link {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: #fff;
          opacity: 0;
          transition: opacity 0.2s ease-in-out;
        }
        .rung:hover .rung__link,
        .rung__link:focus {
          opacity: 1;
          background: rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </section>
  );
}
