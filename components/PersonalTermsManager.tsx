"use client";

import { useEffect, useState } from "react";
import { safeParse } from "../src/utils/safeJson";

interface PersonalTerm {
  slug: string;
  term: string;
  definition: string;
}

interface ImportPreview {
  duplicates: {
    slug: string;
    existing: PersonalTerm;
    incoming: PersonalTerm;
  }[];
  newTerms: PersonalTerm[];
}

export default function PersonalTermsManager() {
  const [terms, setTerms] = useState<PersonalTerm[]>([]);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [summary, setSummary] = useState<{ added: number; updated: number } | null>(
    null,
  );

  // Load stored personal terms on first render
  useEffect(() => {
    const raw = localStorage.getItem("personalTerms");
    setTerms(safeParse<PersonalTerm[]>(raw, []));
  }, []);

  // Helper to persist changes
  const save = (next: PersonalTerm[]) => {
    setTerms(next);
    localStorage.setItem("personalTerms", JSON.stringify(next));
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(terms, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "personal-terms.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const incoming = safeParse<PersonalTerm[]>(text, []);
      const map = new Map(terms.map((t) => [t.slug, t]));
      const duplicates: ImportPreview["duplicates"] = [];
      const newTerms: PersonalTerm[] = [];
      for (const term of incoming) {
        const existing = map.get(term.slug);
        if (existing) {
          duplicates.push({ slug: term.slug, existing, incoming: term });
        } else {
          newTerms.push(term);
        }
      }
      setPreview({ duplicates, newTerms });
    } catch (err) {
      console.error("Invalid import", err);
    } finally {
      e.target.value = ""; // reset input
    }
  };

  const confirmMerge = () => {
    if (!preview) return;
    const map = new Map(terms.map((t) => [t.slug, t]));
    let added = 0;
    let updated = 0;
    for (const t of preview.newTerms) {
      map.set(t.slug, t);
      added++;
    }
    for (const d of preview.duplicates) {
      map.set(d.slug, d.incoming);
      updated++;
    }
    const merged = Array.from(map.values());
    save(merged);
    setPreview(null);
    setSummary({ added, updated });
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Personal Terms</h2>
      <div className="flex gap-4 items-center">
        <button
          type="button"
          onClick={handleExport}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Export
        </button>
        <input
          type="file"
          accept="application/json"
          onChange={handleImport}
        />
      </div>

      {preview && (
        <div className="border p-3 space-y-2">
          <h3 className="font-medium">Import Preview</h3>
          {preview.newTerms.length > 0 && (
            <p>{preview.newTerms.length} new term(s) will be added.</p>
          )}
          {preview.duplicates.length > 0 && (
            <div>
              <p>{preview.duplicates.length} duplicate(s) will be replaced:</p>
              <ul className="list-disc pl-5">
                {preview.duplicates.map((d) => (
                  <li key={d.slug}>
                    <strong>{d.slug}</strong>
                    <div className="text-sm">
                      <div>
                        <em>Existing:</em> {d.existing.definition}
                      </div>
                      <div>
                        <em>Incoming:</em> {d.incoming.definition}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            type="button"
            onClick={confirmMerge}
            className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
          >
            Merge
          </button>
        </div>
      )}

      {summary && (
        <div className="border p-3" role="alert">
          <p>
            Import complete: {summary.added} added, {summary.updated} updated.
          </p>
          <button
            type="button"
            className="mt-2 px-3 py-1 bg-gray-300 rounded"
            onClick={() => setSummary(null)}
          >
            Close
          </button>
        </div>
      )}
    </section>
  );
}

