'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { searchPersonalTerms, PersonalTerm } from '../../lib/personalTerms';

interface Term {
  term: string;
  definition: string;
}

interface SearchResponse {
  results: Term[];
  suggestions: string[];
}


export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [data, setData] = useState<SearchResponse | null>(null);
  const [personal, setPersonal] = useState<PersonalTerm[]>([]);

  useEffect(() => {
    if (!query) return;
    fetch(`/api/search?q=${encodeURIComponent(query)}&limit=50&offset=0`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData({ results: [], suggestions: [] }));
    searchPersonalTerms(query).then(setPersonal);
  }, [query]);

  const results = data?.results || [];
  const combined = [
    ...personal.map((p) => ({ term: p.slug, definition: p.definition, personal: true })),
    ...results.map((r) => ({ ...r, personal: false })),
  ];
  const suggestions = data?.suggestions || [];

  return (
    <>
      <Head>
        <title>Search – Cyber Security Dictionary</title>
        <meta
          name="description"
          content="Search cybersecurity terms in the dictionary."
        />
        <meta
          property="og:title"
          content="Search – Cyber Security Dictionary"
        />
        <meta
          property="og:description"
          content="Search cybersecurity terms in the dictionary."
        />
      </Head>
      <div>
        {suggestions.length > 0 && (
          <div className="suggestions">
            <p>Did you mean:</p>
            <ul>
              {suggestions.map((s) => (
                <li key={s}>
                  <Link href={`/search?q=${encodeURIComponent(s)}`}>{s}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <ul>
          {combined.map((r) => (
            <li key={r.term}>
              <strong>{r.term}</strong>
              {r.personal && <span className="badge"> Personal</span>}: {r.definition}
            </li>
          ))}
          {combined.length === 0 && <li>No results found.</li>}
        </ul>
      </div>
    </>
  );
}

