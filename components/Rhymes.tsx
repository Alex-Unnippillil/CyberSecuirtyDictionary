import { useEffect, useState } from "react";

interface Rhyme {
  word: string;
  numSyllables?: number;
}

export default function Rhymes({ slug }: { slug: string }) {
  const [groups, setGroups] = useState<Record<number, string[]>>({});

  useEffect(() => {
    if (!slug) {
      setGroups({});
      return;
    }

    fetch(`/api/rhymes?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data: Rhyme[]) => {
        const grouped: Record<number, string[]> = {};
        data.forEach(({ word, numSyllables = 0 }) => {
          if (!grouped[numSyllables]) {
            grouped[numSyllables] = [];
          }
          grouped[numSyllables].push(word);
        });
        setGroups(grouped);
      })
      .catch(() => setGroups({}));
  }, [slug]);

  return (
    <div>
      {Object.keys(groups)
        .map((k) => parseInt(k, 10))
        .sort((a, b) => a - b)
        .map((count) => (
          <div key={count}>
            <h3>
              {count} syllable{count === 1 ? "" : "s"}
            </h3>
            <ul>
              {groups[count].map((word) => (
                <li key={word}>{word}</li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}
