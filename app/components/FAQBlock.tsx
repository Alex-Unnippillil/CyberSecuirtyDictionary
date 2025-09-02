import React from "react";

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
    <section className="mt-8 rounded-lg bg-gray-100 p-4 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
      <h2 className="mb-4 text-2xl font-semibold">FAQ</h2>
      {items.map((item, idx) => (
        <div key={idx} className="mb-4">
          <h3 className="font-medium">{item.question}</h3>
          <p className="text-gray-700 dark:text-gray-300">{item.answer}</p>
        </div>
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
