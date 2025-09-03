import React from "react";
import sanitize from "../../src/utils/sanitize";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQBlockProps {
  items: FAQItem[];
}

export function FAQBlock({ items }: FAQBlockProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const jsonLdString = sanitize(JSON.stringify(jsonLd));

  return (
    <section>
      <h2>FAQ</h2>
      {items.map((item, idx) => (
        <div key={idx}>
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </div>
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />
    </section>
  );
}
