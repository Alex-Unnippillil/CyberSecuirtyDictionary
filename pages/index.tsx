import { GetStaticProps } from 'next';
import path from 'path';
import { promises as fs } from 'fs';
import SelectionTools from '../components/SelectionTools';

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
      <SelectionTools />
    </main>
  );
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const filePath = path.join(process.cwd(), 'terms.json');
  const json = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(json);
  const terms: Term[] = data.terms || [];
  return {
    props: {
      terms,
    },
  };
};
