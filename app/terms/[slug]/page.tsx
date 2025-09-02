import React from "react";
import terms from "../../../public/terms.json";
import { FAQBlock } from "../../components/FAQBlock";

function slugify(term: string) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function TermPage({ params }: { params: { slug: string } }) {
  const term = terms.terms.find((t) => slugify(t.term) === params.slug);

  if (!term) {
    return <div>Term not found</div>;
  }

  const termJsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.definition,
    url: `https://example.com/terms/${params.slug}`,
  };

  const faqItems = [
    {
      question: `What is ${term.term}?`,
      answer: term.definition,
    },
  ];

  return (
    <main>
      <h1>{term.term}</h1>
      <p>{term.definition}</p>
      <FAQBlock items={faqItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termJsonLd) }}
      />
    </main>
  );
}
