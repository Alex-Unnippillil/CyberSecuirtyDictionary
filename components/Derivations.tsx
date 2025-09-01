import Link from "next/link";

interface DerivationsProps {
  derivations: string[];
}

const slugify = (term: string) =>
  term
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-");

export default function Derivations({ derivations }: DerivationsProps) {
  if (!derivations || derivations.length === 0) {
    return null;
  }

  return (
    <section>
      <h2>Derivations</h2>
      <ul>
        {derivations.map((term) => (
          <li key={term}>
            <Link href={`/${slugify(term)}`}>{term}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
