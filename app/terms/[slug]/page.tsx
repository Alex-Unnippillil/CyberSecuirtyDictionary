import React from "react";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import dynamic from "next/dynamic";

const FAQBlock = dynamic(() => import("../../components/FAQBlock"));

interface Term {
  name: string;
  slug: string;
  definition: string;
  synonyms?: string[];
}

function loadTerms(): Term[] {
  const filePath = path.join(process.cwd(), "data", "terms.yaml");
  const file = fs.readFileSync(filePath, "utf8");
  return yaml.load(file) as Term[];
}

export async function generateStaticParams() {
  return loadTerms().map((term) => ({ slug: term.slug }));
}

export default function TermPage({ params }: { params: { slug: string } }) {
  const term = loadTerms().find((t) => t.slug === params.slug);

  if (!term) {
    return <div>Term not found</div>;
  }

  const termJsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.name,
    description: term.definition,
    url: `https://example.com/terms/${params.slug}`,
  };

  const faqItems = [
    {
      question: `What is ${term.name}?`,
      answer: term.definition,
    },
  ];

  return (
    <main>
      <h1>{term.name}</h1>
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
