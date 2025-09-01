import termsData from "../../terms.json";

interface Term {
  term: string;
  definition: string;
}

const termMap: Record<string, Term> = Object.fromEntries(
  termsData.terms.map((t: Term) => [t.term.toLowerCase(), t]),
);

interface PageProps {
  searchParams?: { term1?: string; term2?: string };
}

export default function ComparePage({ searchParams }: PageProps) {
  const key1 = searchParams?.term1?.toLowerCase() ?? "";
  const key2 = searchParams?.term2?.toLowerCase() ?? "";

  const t1 = termMap[key1];
  const t2 = termMap[key2];

  return (
    <main style={{ display: "flex", gap: "1rem" }}>
      <section style={{ flex: 1 }}>
        {t1 ? (
          <>
            <h2>{t1.term}</h2>
            <p>{t1.definition}</p>
          </>
        ) : (
          <p>Term 1 not found.</p>
        )}
      </section>
      <section style={{ flex: 1 }}>
        {t2 ? (
          <>
            <h2>{t2.term}</h2>
            <p>{t2.definition}</p>
          </>
        ) : (
          <p>Term 2 not found.</p>
        )}
      </section>
    </main>
  );
}
