import { GetStaticPaths, GetStaticProps } from 'next';

interface Phonetic {
  text?: string;
  audio?: string;
}

interface Entry {
  word: string;
  phonetics?: Phonetic[];
}

interface EntryPageProps {
  entry: Entry;
}

function syllabify(word: string): string {
  return word
    .toLowerCase()
    .split(/(?<=[aeiouy])/)
    .join('·');
}

export default function EntryPage({ entry }: EntryPageProps) {
  const ipa = entry.phonetics?.find(p => p.text)?.text || '';
  const audio = entry.phonetics?.find(p => p.audio)?.audio || '';
  const syllables = syllabify(entry.word);

  return (
    <div>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h1>{entry.word}</h1>
        <span>{syllables}</span>
        {ipa && <span>{ipa}</span>}
        {audio && <audio controls src={audio}></audio>}
      </header>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<EntryPageProps> = async (context) => {
  const { slug } = context.params as { slug: string };
  const res = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${slug}`
  );

  if (!res.ok) {
    return { notFound: true };
  }

  const data = await res.json();
  const entry = data[0];

  return {
    props: {
      entry,
    },
    revalidate: 86400,
  };
};
