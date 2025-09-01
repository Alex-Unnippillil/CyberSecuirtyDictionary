import React from "react";
import TermBody from "../../../../components/TermBody";
import PromptChips from "../../../../components/PromptChips";
import ExpandPane from "../../../../components/ExpandPane";
import TermCard, { Term } from "../../../../components/TermCard";
import EmptyState from "../../../../components/EmptyState";
import termsFile from "../../../../terms.json";

interface TermData extends Term {
  body: string;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function getTerms(): Promise<TermData[]> {
  const data = termsFile as any;
  return data.terms.map((t: any) => ({
    slug: slugify(t.term),
    title: t.term,
    description: t.definition,
    body: `<p>${t.definition}</p>`,
  }));
}

export default async function TermPage({
  params,
}: {
  params: { slug: string };
}) {
  const terms = await getTerms();
  const term = terms.find((t) => t.slug === params.slug);

  if (!term) {
    return <EmptyState message="Term not found" />;
  }

  const related = terms.filter((t) => t.slug !== term.slug).slice(0, 4);
  const prompts = [
    `Explain ${term.title} like I'm five`,
    `Why is ${term.title} important?`,
    `Give an example of ${term.title}`,
  ];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{term.title}</h1>
      </header>
      <TermBody body={term.body} />
      <section className="my-6">
        <h2 className="font-semibold mb-2">Prompts</h2>
        <PromptChips prompts={prompts} />
      </section>
      <ExpandPane summary="More information">
        <p>{term.description}</p>
      </ExpandPane>
      <section className="my-8">
        <h2 className="font-semibold mb-4">Related Terms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {related.map((t) => (
            <TermCard key={t.slug} term={t} />
          ))}
        </div>
      </section>
    </div>
  );
}
