import { notFound } from 'next/navigation';
import termsData from '../../terms.json';

interface Term {
  term: string;
  definition: string;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}

function findTerm(slug: string): Term | undefined {
  const normalized = decodeURIComponent(slug).replace(/-/g, ' ').toLowerCase();
  return (termsData as { terms: Term[] }).terms.find(
    (t) => t.term.toLowerCase() === normalized
  );
}

export default function TermPage({ params }: { params: { term: string } }) {
  const term = findTerm(params.term);
  if (!term) notFound();
  return (
    <main>
      <h1>{term.term}</h1>
      <p>{term.definition}</p>
    </main>
  );
}

export function generateStaticParams() {
  return (termsData as { terms: Term[] }).terms.map((t) => ({
    term: slugify(t.term),
  }));
}
