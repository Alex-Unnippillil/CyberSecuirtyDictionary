'use client';

import { useEffect, useState } from 'react';
import { getTags, saveTag, getTermTags, setTermTags, Tag } from '../lib/tagDB';

interface Props {
  term: string;
}

/**
 * TagManager allows creating colored tags and associating them with a term.
 */
export default function TagManager({ term }: Props) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');

  useEffect(() => {
    getTags().then(setTags).catch(() => setTags([]));
    getTermTags(term).then(setSelected).catch(() => setSelected([]));
  }, [term]);

  const addTag = async () => {
    if (!name.trim()) return;
    const newTag = await saveTag({ name: name.trim(), color });
    setTags([...tags, newTag]);
    setName('');
  };

  const toggle = async (id: number) => {
    const next = selected.includes(id)
      ? selected.filter((t) => t !== id)
      : [...selected, id];
    setSelected(next);
    await setTermTags(term, next);
  };

  return (
    <section className="tag-manager">
      <h3>Tags</h3>
      <ul>
        {tags.map((t) => (
          <li key={t.id}>
            <label style={{ color: t.color }}>
              <input
                type="checkbox"
                checked={selected.includes(t.id!)}
                onChange={() => toggle(t.id!)}
              />
              {t.name}
            </label>
          </li>
        ))}
      </ul>
      <div className="new-tag">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New tag"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <button onClick={addTag}>Add</button>
      </div>
    </section>
  );
}
