import { useEffect, useState } from 'react';

interface Term {
  term: string;
  definition: string;
}

const SESSION_KEY = 'clipboard-preview-shown';

function getShown(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || '[]');
  } catch {
    return [];
  }
}

function markShown(term: string): void {
  try {
    const shown = new Set(getShown());
    shown.add(term);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(Array.from(shown)));
  } catch {
    // ignore storage errors
  }
}

export default function ClipboardPreview({ terms }: { terms: Term[] }) {
  const [current, setCurrent] = useState<Term | null>(null);

  useEffect(() => {
    async function handleCopy() {
      if (!navigator.clipboard) return;
      try {
        const perm = await navigator.permissions.query({
          name: 'clipboard-read' as PermissionName,
        });
        if (perm.state === 'denied') return;
      } catch {
        // permissions API might not be available
      }
      try {
        const text = (await navigator.clipboard.readText()).trim();
        const match = terms.find(
          (t) => t.term.toLowerCase() === text.toLowerCase()
        );
        if (match && !getShown().includes(match.term)) {
          markShown(match.term);
          setCurrent(match);
        }
      } catch {
        // ignore clipboard errors
      }
    }

    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, [terms]);

  if (!current) return null;

  return (
    <div className="clipboard-preview" role="dialog">
      <button
        aria-label="Close preview"
        onClick={() => setCurrent(null)}
      >
        &times;
      </button>
      <h3>{current.term}</h3>
      <p>{current.definition}</p>
    </div>
  );
}
