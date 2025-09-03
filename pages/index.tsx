import { GetStaticProps } from 'next';
import path from 'path';
import { promises as fs } from 'fs';
import { safeParse } from '../src/utils/safeJson';

interface Term {
  term: string;
  definition: string;
}

interface HomePageProps {
  terms: Term[];
}

export default function HomePage({ terms }: HomePageProps) {
  return (
    <main>
      <h1>Cybersecurity Terms</h1>
      <ul>
        {terms.map((t) => (
          <li key={t.term}>{t.term}</li>
        ))}
      </ul>
    </main>
  );
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const filePath = path.join(process.cwd(), 'terms.json');
  const json = await fs.readFile(filePath, 'utf-8');
  const data = safeParse<{ terms?: Term[] }>(json, { terms: [] });
  const terms: Term[] = data.terms || [];
  return {
    props: {
      terms,
    },
  };
};
