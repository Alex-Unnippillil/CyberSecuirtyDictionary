import React from "react";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

interface Term {
  name: string;
  slug?: string;
  definition: string;
  category?: string;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTerms(): Term[] {
  const filePath = path.join(process.cwd(), "data", "terms.yaml");
  const file = fs.readFileSync(filePath, "utf8");
  return yaml.load(file) as Term[];
}

export async function generateStaticParams() {
  const terms = getTerms();
  const categories = Array.from(
    new Set(terms.map((t) => t.category).filter(Boolean)),
  );
  return categories.map((category) => ({
    category: slugify(category as string),
  }));
}

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const terms = getTerms();
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
          <li key={term.slug || slugify(term.name)}>
            <strong>{term.name}</strong>: {term.definition}
          </li>
        ))}
      </ul>
    </main>
  );
}
