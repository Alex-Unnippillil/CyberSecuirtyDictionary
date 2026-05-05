import React from "react";
import { getAllTerms } from "@/lib/content/api";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateStaticParams() {
  const terms = getAllTerms();
  const categories = Array.from(new Set(terms.map((t) => t.category).filter(Boolean)));
  return categories.map((category) => ({
    category: slugify(category as string),
  }));
}

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const terms = getAllTerms();
  const categoryTerms = terms.filter(
    (t) => t.category && slugify(t.category) === params.category,
  );

  if (categoryTerms.length === 0) {
    return <div>Category not found</div>;
  }

  const categoryName = categoryTerms[0].category as string;

  return (
    <main>
      <h1>{categoryName}</h1>
      <ul>
        {categoryTerms.map((term) => (
          <li key={term.slug}>
            <strong>{term.title}</strong>: {term.definition}
          </li>
        ))}
      </ul>
    </main>
  );
}
