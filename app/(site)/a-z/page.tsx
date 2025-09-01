import { useMemo, useState } from 'react';
import Link from 'next/link';
import { allTerms } from 'contentlayer/generated';

const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

type Term = {
  title: string;
  slug: string;
  tags?: string[];
};

export default function AZPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    allTerms.forEach((term: Term) => {
      term.tags?.forEach((tag) => set.add(tag));
    });
    return Array.from(set).sort();
  }, []);

  const termsByLetter = useMemo(() => {
    const grouped: Record<string, Term[]> = {};
    LETTERS.forEach((l) => {
      grouped[l] = [];
    });
    allTerms.forEach((term: Term) => {
      const first = term.title?.[0]?.toUpperCase();
      if (first && grouped[first]) {
        grouped[first].push(term);
      }
    });
    LETTERS.forEach((l) => grouped[l].sort((a, b) => a.title.localeCompare(b.title)));
    return grouped;
  }, []);

  const filteredTerms = useMemo(() => {
    if (selectedTags.length === 0) return termsByLetter;
    const grouped: Record<string, Term[]> = {};
    LETTERS.forEach((l) => {
      grouped[l] = termsByLetter[l].filter((term) =>
        selectedTags.every((tag) => term.tags?.includes(tag))
      );
    });
    return grouped;
  }, [selectedTags, termsByLetter]);

  const onTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions).map((o) => o.value);
    setSelectedTags(values);
  };

  return (
    <div>
      <div>
        <label htmlFor="tags">Filter by tag</label>
        <select
          id="tags"
          multiple
          value={selectedTags}
          onChange={onTagChange}
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {LETTERS.map((letter) => {
        const terms = filteredTerms[letter];
        if (!terms || terms.length === 0) return null;
        return (
          <section key={letter}>
            <h2>{letter}</h2>
            <ul>
              {terms.map((term) => (
                <li key={term.slug}>
                  <Link href={`/term/${term.slug}`}>{term.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

