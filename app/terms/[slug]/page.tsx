import React from "react";
import { FAQBlock } from "../../components/FAQBlock";
import { getAllTerms, getTermBySlug } from "@/lib/content/api";

export async function generateStaticParams() {
  return getAllTerms().map((term) => ({ slug: term.slug }));
}

export default function TermPage({ params }: { params: { slug: string } }) {
  const term = getTermBySlug(params.slug);

  if (!term) {
    return <div>Term not found</div>;
  }

  const termJsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.title,
    description: term.definition,
    url: `https://example.com/terms/${params.slug}`,
  };

  const faqItems = [
    {
      question: `What is ${term.title}?`,
      answer: term.definition,
    },
  ];

  return (
    <main>
      <h1>{term.title}</h1>
      <p>{term.definition}</p>
      {term.synonyms && term.synonyms.length > 0 && (
        <p>
          <strong>Synonyms:</strong> {term.synonyms.join(", ")}
        </p>
      )}
      <FAQBlock items={faqItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termJsonLd) }}
      />
    </main>
  );
}
