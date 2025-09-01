import ExpandTerm from '@/components/ExpandTerm';
import { getTermBySlug } from '@/lib/terms';

export default async function TermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = await getTermBySlug(slug);
  return (
    <main>
      <h1>{term.term}</h1>
      <p>{term.definition}</p>
      <ExpandTerm term={term.term} definition={term.definition} />
    </main>
  );
}
