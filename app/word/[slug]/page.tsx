import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface WordPageProps {
  params: { slug: string };
}

interface DictionaryEntry {
  word: string;
  phonetics?: { text?: string; audio?: string }[];
}

function syllabify(word: string): string {
  return word.split(/(?<=[aeiouy])/gi).join("·");
}

export async function generateMetadata({
  params,
}: WordPageProps): Promise<Metadata> {
  return {
    title: params.slug,
  };
}

export default async function WordPage({ params }: WordPageProps) {
  const res = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${params.slug}`,
  );
  if (!res.ok) {
    notFound();
  }

  const json: DictionaryEntry[] = await res.json();
  const entry = json[0];
  const headword = entry.word || params.slug;
  const phonetic = entry.phonetics?.find((p) => p.text || p.audio) || {};
  const ipa = phonetic.text;
  const audio = phonetic.audio;
  const syllables = syllabify(headword);

  return (
    <div>
      <header className="sticky top-0 bg-white p-4 shadow">
        <h1>{headword}</h1>
        <p>{syllables}</p>
        {ipa && <p>{ipa}</p>}
        {audio && (
          <audio controls src={audio}>
            Your browser does not support the audio element.
          </audio>
        )}
      </header>
    </div>
  );
}
