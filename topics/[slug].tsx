import { GetStaticPaths, GetStaticProps } from "next";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

interface Term {
  name: string;
  slug: string;
  definition: string;
  see_also?: string[];
}

interface TermSummary {
  name: string;
  slug: string;
  summary: string;
}

interface Props {
  term: Term;
  related: TermSummary[];
}

export default function TopicPage({ term, related }: Props) {
  return (
    <main>
      <h1>{term.name}</h1>
      <div className="grid">
        {related.map((r) => (
          <a key={r.slug} href={`/topics/${r.slug}`} className="tile">
            <h2>{r.name}</h2>
            <p>{r.summary}</p>
          </a>
        ))}
      </div>
      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        .tile {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
          text-decoration: none;
          color: inherit;
          background: #fff;
        }
        .tile:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        h2 {
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }
        p {
          margin: 0;
          font-size: 0.9rem;
        }
      `}</style>
    </main>
  );
}

const dataFilePath = path.join(process.cwd(), "data", "terms.yaml");

function loadTerms(): Term[] {
  const file = fs.readFileSync(dataFilePath, "utf8");
  return (yaml.load(file) as Term[]) || [];
}

function summarize(text: string, wordCount = 20): string {
  const words = text.split(/\s+/);
  return (
    words.slice(0, wordCount).join(" ") +
    (words.length > wordCount ? "..." : "")
  );
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-");
}

export const getStaticPaths: GetStaticPaths = async () => {
  const terms = loadTerms();
  const paths = terms.map((t) => ({ params: { slug: t.slug } }));
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const terms = loadTerms();
  const slug = params?.slug as string;
  const term = terms.find((t) => t.slug === slug);

  if (!term) {
    return { notFound: true };
  }

  const related = (term.see_also || [])
    .map((name) => {
      const relatedSlug = slugify(name);
      const relatedTerm = terms.find((t) => t.slug === relatedSlug);
      if (!relatedTerm) return null;
      return {
        name: relatedTerm.name,
        slug: relatedTerm.slug,
        summary: summarize(relatedTerm.definition),
      };
    })
    .filter(Boolean) as TermSummary[];

  return {
    props: {
      term,
      related,
    },
    revalidate: 86400,
  };
};
