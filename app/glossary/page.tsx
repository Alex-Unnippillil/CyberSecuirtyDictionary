import { draftMode } from 'next/headers';
import TermsList from './TermsList';
import data from '../../terms.json';

export const dynamic = 'force-static';
export const experimental_ppr = true;

interface Term {
  term: string;
  definition: string;
  draft?: boolean;
}

export default async function GlossaryPage() {
  const { isEnabled } = await draftMode();
  const terms: Term[] = (data as { terms: Term[] }).terms;
  const visible = isEnabled ? terms : terms.filter(t => !t.draft);

  return (
    <main>
      <h1>Glossary</h1>
      <TermsList terms={visible} />
    </main>
  );
}
