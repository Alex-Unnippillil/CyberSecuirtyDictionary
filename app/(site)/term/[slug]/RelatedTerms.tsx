import Link from "next/link";
import { allTerms } from "contentlayer/generated";

interface RelatedTermsProps {
  slugs?: string[];
}

export default function RelatedTerms({ slugs }: RelatedTermsProps) {
  if (!slugs || slugs.length === 0) return null;
  return (
    <section aria-labelledby="related-terms-heading">
      <h2 id="related-terms-heading">Related Terms</h2>
      <ul>
        {slugs.map((slug) => {
          const term = allTerms.find((t) => t.slug === slug);
          const title = term?.title ?? slug;
          return (
            <li key={slug}>
              <Link href={`/term/${slug}`}>{title}</Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
