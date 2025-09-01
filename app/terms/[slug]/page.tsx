import React from 'react';
import RelatedGraph from '../../../components/RelatedGraph';
import termsData from '../../../terms.json';

interface Term {
  term: string;
  definition: string;
}

interface TermPageProps {
  params: { slug: string };
}

export default function TermPage({ params }: TermPageProps) {
  const decoded = decodeURIComponent(params.slug).replace(/-/g, ' ');
  const termEntry = (termsData as { terms: Term[] }).terms.find(
    (t) => t.term.toLowerCase() === decoded.toLowerCase()
  );

  const related = (termsData as { terms: Term[] }).terms
    .filter((t) => t.term !== termEntry?.term)
    .slice(0, 3);

  const nodes = [{ id: termEntry?.term || decoded }, ...related.map((r) => ({ id: r.term }))];
  const links = related.map((r) => ({ source: termEntry?.term || decoded, target: r.term }));

  return (
    <div>
      <h1>{termEntry?.term || decoded}</h1>
      <p>{termEntry?.definition || 'Definition not found.'}</p>
      <RelatedGraph nodes={nodes} links={links} />
    </div>
  );
}
