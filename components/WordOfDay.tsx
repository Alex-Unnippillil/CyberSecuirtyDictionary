import React, { useState } from "react";
import useSWR from "swr";

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
  const [offset, setOffset] = useState(0);
  const { data: entry } = useSWR<Entry>(
    `/api/word-of-day?offset=${offset}`,
    { refreshInterval: 86400000 }
  );

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
