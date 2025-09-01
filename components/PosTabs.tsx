'use client';

import { useState } from 'react';
import useSWR from 'swr';

const partsOfSpeech = ['noun', 'verb', 'adjective', 'adverb'];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface PosTabsProps {
  slug: string;
}

export default function PosTabs({ slug }: PosTabsProps) {
  const [active, setActive] = useState(partsOfSpeech[0]);

  return (
    <div>
      <div className="pos-tabs">
        {partsOfSpeech.map((pos) => (
          <button
            key={pos}
            onClick={() => setActive(pos)}
            disabled={active === pos}
          >
            {pos}
          </button>
        ))}
      </div>
      <div className="pos-content">
        {partsOfSpeech.map((pos) => {
          const { data, error } = useSWR(
            `/api/word/${slug}/${pos}`,
            fetcher
          );
          if (pos !== active) return null;
          if (error) return <p>Failed to load {pos}</p>;
          if (!data) return <p>Loading {pos}...</p>;
          return (
            <pre key={pos}>{JSON.stringify(data, null, 2)}</pre>
          );
        })}
      </div>
    </div>
  );
}

