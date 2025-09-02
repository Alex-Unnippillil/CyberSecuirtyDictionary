"use client";

import { useEffect, useState } from "react";

interface Term {
  term: string;
  definition: string;
}

export default function AdminPanel() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editingDefinition, setEditingDefinition] = useState("");

  useEffect(() => {
    fetchTerms();
  }, []);

  async function fetchTerms() {
    const res = await fetch("/api/terms");
    const data = await res.json();
    setTerms(data);
  }

  async function addTerm() {
    await fetch("/api/terms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ term, definition }),
    });
    setTerm("");
    setDefinition("");
    fetchTerms();
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
    fetchTerms();
  }

  async function deleteTerm(t: string) {
    await fetch(`/api/terms/${encodeURIComponent(t)}`, { method: "DELETE" });
    fetchTerms();
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
      </ul>
    </div>
  );
}
