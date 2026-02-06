import React, { useEffect, useRef, useState } from "react";

interface Entry {
  id: string;
  word: string;
  definition: string;
}

/**
 * WordOfDay displays a daily dictionary entry and provides
 * navigation to previous/next days along with an option to
 * save entries for later reference.
 */
const WordOfDay: React.FC = () => {
  const [entry, setEntry] = useState<Entry | null>(null);
  const [offset, setOffset] = useState(0);

  const fetchEntry = async (dayOffset: number) => {
    const storageKey = `word-of-day:${dayOffset}`;
    try {
      const res = await fetch(`/api/word-of-day?offset=${dayOffset}`);
      if (!res.ok) throw new Error("Failed to fetch word of day");
      const data = await res.json();
      setEntry(data);
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch {
        /* ignore storage errors */
      }
    } catch (err) {
      console.error(err);
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        try {
          setEntry(JSON.parse(cached));
          return;
        } catch {
          /* ignore parse errors */
        }
      }
      setEntry(null);
    }
  };

  const prevOffsetRef = useRef<number | null>(null);
  useEffect(() => {
    if (prevOffsetRef.current === offset) return;
    prevOffsetRef.current = offset;
    fetchEntry(offset);
  }, [offset]);

  const handlePrev = () => setOffset((o) => o - 1);
  const handleNext = () => setOffset((o) => o + 1);

  const handleSave = () => {
    if (!entry) return;
    const saved: Entry[] = JSON.parse(
      localStorage.getItem("savedWords") || "[]",
    );
    if (!saved.find((e) => e.id === entry.id)) {
      saved.push(entry);
      localStorage.setItem("savedWords", JSON.stringify(saved));
    }
  };

  if (!entry) return <p>Loading...</p>;

  return (
    <div className="word-of-day">
      <h2>{entry.word}</h2>
      <p>{entry.definition}</p>
      <div className="word-of-day__actions">
        <button onClick={handlePrev}>Previous</button>
        <button onClick={handleNext}>Next</button>
        <button onClick={handleSave}>Save to list</button>
      </div>
    </div>
  );
};

export default WordOfDay;
