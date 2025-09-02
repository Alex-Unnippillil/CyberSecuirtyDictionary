'use client';

import { useState, FormEvent, useEffect } from 'react';
import { PersonalTerm, savePersonalTerm } from '../lib/personalTerms';

interface PersonalTermFormProps {
  initial?: PersonalTerm;
  onSave?: (term: PersonalTerm) => void;
}

export default function PersonalTermForm({ initial, onSave }: PersonalTermFormProps) {
  const [slug, setSlug] = useState(initial?.slug || '');
  const [definition, setDefinition] = useState(initial?.definition || '');
  const [tags, setTags] = useState(initial?.tags.join(', ') || '');
  const [source, setSource] = useState(initial?.source || '');

  useEffect(() => {
    if (initial) {
      setSlug(initial.slug);
      setDefinition(initial.definition);
      setTags(initial.tags.join(', '));
      setSource(initial.source);
    }
  }, [initial]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const term: PersonalTerm = {
      slug,
      definition,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      source,
    };
    await savePersonalTerm(term);
    onSave?.(term);
    setSlug('');
    setDefinition('');
    setTags('');
    setSource('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Slug
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Definition
          <textarea
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Tags (comma separated)
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Source
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </label>
      </div>
      <button type="submit">Save</button>
    </form>
  );
}
