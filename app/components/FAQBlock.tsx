import React from "react";
import Script from "next/script";

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

  return (
    <section>
      <h2>FAQ</h2>
      {items.map((item, idx) => (
        <div key={idx}>
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </div>
      ))}
      <Script id="faq-jsonld" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
    </section>
  );
}
