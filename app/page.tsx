import Link from 'next/link';
import Search from '@/components/Search';
import { getAllTerms } from '@/lib/terms';

export default async function Home() {
  const terms = await getAllTerms();
  return (
    <main>
      <h1>Cybersecurity Dictionary</h1>
      <Search />
      <ul>
        {terms.map((t) => (
          <li key={t.slug}>
            <Link href={`/terms/${t.slug}`}>{t.term}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
