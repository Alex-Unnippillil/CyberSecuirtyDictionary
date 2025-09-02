import { notFound } from "next/navigation";

interface Phonetic {
  text?: string;
  audio?: string;
}

interface Entry {
  word: string;
  phonetics?: Phonetic[];
}

function syllabify(word: string): string {
  return word
    .toLowerCase()
    .split(/(?<=[aeiouy])/)
    .join("·");
}

export const revalidate = 0;

export default async function EntryPage({
  params,
}: {
  params: { slug: string };
}) {
  const res = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${params.slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  const entry: Entry = data[0];

  const ipa = entry.phonetics?.find((p) => p.text)?.text || "";
  const audio = entry.phonetics?.find((p) => p.audio)?.audio || "";
  const syllables = syllabify(entry.word);

  return (
    <div>
      <header style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <h1>{entry.word}</h1>
        <span>{syllables}</span>
        {ipa && <span>{ipa}</span>}
        {audio && <audio controls src={audio}></audio>}
      </header>
    </div>
  );
}

