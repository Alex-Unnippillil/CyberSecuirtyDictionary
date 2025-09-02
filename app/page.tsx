import React from "react";

interface Term {
  term: string;
  definition: string;
}

export default async function HomePage() {
  // Fetch terms data on every request without caching
  const res = await fetch(
    "https://raw.githubusercontent.com/Alex-Unnippillil/CyberSecuirtyDictionary/main/terms.json",
    { cache: "no-store" }
  );
  const data = await res.json();
  const terms: Term[] = data.terms || [];

  return (
    <main>
      <h1>Cyber Security Terms</h1>
      <ul>
        {terms.map((t) => (
          <li key={t.term}>
            <strong>{t.term}:</strong> {t.definition}
          </li>
        ))}
      </ul>
    </main>
  );
}
