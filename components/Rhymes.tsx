import { useEffect, useState } from "react";
import useSWR from "swr";

interface Rhyme {
  word: string;
  numSyllables?: number;
}

export default function Rhymes({ slug }: { slug: string }) {
  const [groups, setGroups] = useState<Record<number, string[]>>({});
  const { data } = useSWR<Rhyme[]>(
    slug ? `/api/rhymes?slug=${encodeURIComponent(slug)}` : null,
    { refreshInterval: 0 }
  );

  useEffect(() => {
    if (!data) {
      setGroups({});
      return;
    }
    const grouped: Record<number, string[]> = {};
    data.forEach(({ word, numSyllables = 0 }) => {
      if (!grouped[numSyllables]) {
        grouped[numSyllables] = [];
      }
      grouped[numSyllables].push(word);
    });
    setGroups(grouped);
  }, [data]);

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
