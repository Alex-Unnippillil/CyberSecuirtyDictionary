import TermCard from "../../components/search/TermCard";
import termsData from "../../terms.json";

type Term = {
  term: string;
  definition: string;
  tags?: string[];
};

export default function SearchPage() {
  const { terms } = termsData as { terms: Term[] };

  return (
    <main>
      {terms.map((t) => (
        <TermCard
          key={t.term}
          title={t.term}
          definition={t.definition}
          tags={t.tags || []}
        />
      ))}
    </main>
  );
}
