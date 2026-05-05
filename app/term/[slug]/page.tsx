import { notFound } from 'next/navigation';
import TermPage from '@/components/term/TermPage';
import { getAllTerms, getTermBySlug } from '@/lib/content/api';

interface PageProps {
  params: { slug: string };
}

export default async function Page({ params }: PageProps) {
  const term = getTermBySlug(params.slug);

  if (!term) {
    notFound();
  }

  return <TermPage title={term.title} body={term.body} />;
}

export async function generateStaticParams() {
  return getAllTerms().map((term) => ({ slug: term.slug }));
}
