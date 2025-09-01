"use client";

import React, { useEffect, useState } from "react";
import terms from "../../../terms.json";
import { FAQBlock } from "../../components/FAQBlock";
import { readingQueue } from "../../../src/features/queue/ReadingQueue";

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

  const [counts, setCounts] = useState(readingQueue.counts());

  useEffect(() => {
    return readingQueue.subscribe(() => setCounts(readingQueue.counts()));
  }, []);

  const queueNext = () => readingQueue.add("nextUp", term.term);
  const queueLater = () => readingQueue.add("later", term.term);

  return (
    <main>
      <header style={{ display: "flex", justifyContent: "flex-end" }}>
        <span aria-label="Reading queue" title="Reading queue">
          📚 {counts.nextUp + counts.later}
        </span>
      </header>
      <h1>{term.term}</h1>
      <p>{term.definition}</p>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={queueNext}>Queue Next</button>
        <button onClick={queueLater}>Queue Later</button>
      </div>
      <FAQBlock items={faqItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termJsonLd) }}
      />
    </main>
  );
}
