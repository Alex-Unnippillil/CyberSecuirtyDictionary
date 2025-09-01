import React, { useEffect, useState } from "react";

interface WordEntry {
  word: string;
  definition: string;
}

const WordOfDay: React.FC = () => {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState<WordEntry[]>([]);

  useEffect(() => {
    fetch("/api/wotd")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch word of the day");
        }
        return res.json();
      })
      .then((data: WordEntry | WordEntry[]) => {
        if (Array.isArray(data)) {
          setWords(data);
        } else if (data) {
          setWords([data]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("savedWords");
      if (stored) {
        setSaved(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const current = words[index];

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(words.length - 1, i + 1));

  const saveCurrent = () => {
    if (!current) return;
    const newList = [...saved, current];
    setSaved(newList);
    try {
      localStorage.setItem("savedWords", JSON.stringify(newList));
    } catch {
      // ignore storage errors
    }
  };

  return (
    <div>
      {current ? (
        <div>
          <h2>{current.word}</h2>
          <p>{current.definition}</p>
          <button onClick={prev} disabled={index === 0}>
            Previous
          </button>
          <button onClick={next} disabled={index === words.length - 1}>
            Next
          </button>
          <button onClick={saveCurrent}>Save</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default WordOfDay;
