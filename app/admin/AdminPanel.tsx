"use client";

import { useEffect, useState } from "react";

interface Term {
  term: string;
  definition: string;
}

export default function AdminPanel() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editingDefinition, setEditingDefinition] = useState("");

  useEffect(() => {
    fetchTerms(true);
  }, []);

  const LIMIT = 50;

  async function fetchTerms(reset = false) {
    const res = await fetch(
      `/api/terms?offset=${reset ? 0 : offset}&limit=${LIMIT}`
    );
    const data: Term[] = await res.json();
    setTerms((prev) => (reset ? data : [...prev, ...data]));
    setOffset((prev) => (reset ? data.length : prev + data.length));
    setHasMore(data.length === LIMIT);
  }

  async function addTerm() {
    await fetch("/api/terms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ term, definition }),
    });
    setTerm("");
    setDefinition("");
    fetchTerms(true);
  }

  function startEdit(t: Term) {
    setEditing(t.term);
    setEditingDefinition(t.definition);
  }

  async function saveEdit() {
    if (!editing) return;
    await fetch(`/api/terms/${encodeURIComponent(editing)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ definition: editingDefinition }),
    });
    setEditing(null);
    setEditingDefinition("");
    fetchTerms(true);
  }

  async function deleteTerm(t: string) {
    await fetch(`/api/terms/${encodeURIComponent(t)}`, { method: "DELETE" });
    fetchTerms(true);
  }

  return (
    <div>
      <h1>Term Administration</h1>
      <section>
        <h2>Add Term</h2>
        <input
          placeholder="Term"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <input
          placeholder="Definition"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
        />
        <button onClick={addTerm}>Add</button>
      </section>

      <ul>
        {terms.map((t) => (
          <li key={t.term}>
            {editing === t.term ? (
              <>
                <input
                  value={editingDefinition}
                  onChange={(e) => setEditingDefinition(e.target.value)}
                />
                <button onClick={saveEdit}>Save</button>
                <button onClick={() => setEditing(null)}>Cancel</button>
              </>
            ) : (
              <>
                <strong>{t.term}:</strong> {t.definition}
                <button onClick={() => startEdit(t)}>Edit</button>
                <button onClick={() => deleteTerm(t.term)}>Delete</button>
              </>
            )}
          </li>
        ))}
        {terms.length === 0 && <li>No terms found.</li>}
      </ul>
      {hasMore && <button onClick={() => fetchTerms()}>Load More</button>}
    </div>
  );
}
