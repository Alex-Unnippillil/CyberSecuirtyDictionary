import { allTerms } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { useMDXComponent } from "next-contentlayer/hooks";
import RelatedTerms from "./RelatedTerms";
import { mdxSchema } from "@/lib/mdxSchema";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const term = allTerms.find((t) => t.slug === params.slug);
  if (!term) {
    return { title: "Term not found" };
  }
  mdxSchema.parse(term);
  return {
    title: term.title,
    description: term.summary,
  };
}

export default function TermPage({ params }: PageProps) {
  const term = allTerms.find((t) => t.slug === params.slug);
  if (!term) notFound();
  mdxSchema.parse(term);
  const MDXContent = useMDXComponent(term.body.code);
  return (
    <article>
      <header>
        <h1>{term.title}</h1>
        {term.summary && <p>{term.summary}</p>}
      </header>
      <MDXContent />
      {term.sources && term.sources.length > 0 && (
        <section aria-labelledby="sources-heading">
          <h2 id="sources-heading">Sources</h2>
          <ul>
            {term.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url}>{source.name || source.url}</a>
                {source.attack && (
                  <span>
                    {" "}
                    (
                    <a
                      href={source.attack}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ATT&CK
                    </a>
                    )
                  </span>
                )}
                {source.owasp && (
                  <span>
                    {" "}
                    (
                    <a
                      href={source.owasp}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      OWASP
                    </a>
                    )
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
      <RelatedTerms slugs={term.seeAlso} />
    </article>
  );
}
