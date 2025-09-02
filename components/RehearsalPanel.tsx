import React, { useEffect, useState } from "react";

interface RehearsalPanelProps {
  /**
   * The dictionary term this content describes. Used for basic cloze questions.
   */
  term: string;
  /**
   * Full text of the term's entry.
   */
  content: string;
}

interface RecallQuestion {
  question: string;
  answer: string;
  explanation: string;
}

function summarizeText(text: string, count = 3): string[] {
  const sentences = text
    .replace(/\s+/g, " ")
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return sentences.slice(0, count);
}

function sentenceToQuestion(sentence: string, term: string): RecallQuestion {
  const regex = new RegExp(term, "i");
  let question = sentence;
  let answer = term;

  if (regex.test(sentence)) {
    answer = sentence.match(regex)?.[0] || term;
    question = sentence.replace(regex, "_____");
  } else {
    const words = sentence.split(" ");
    const fallback = words.find((w) => w.length > 4) || words[0];
    answer = fallback;
    question = sentence.replace(fallback, "_____");
  }

  return { question, answer, explanation: sentence };
}

function generateQuestions(content: string, term: string): RecallQuestion[] {
  return summarizeText(content, 3).map((s) => sentenceToQuestion(s, term));
}

export default function RehearsalPanel({ term, content }: RehearsalPanelProps) {
  const [questions, setQuestions] = useState<RecallQuestion[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);

  useEffect(() => {
    const q = generateQuestions(content, term);
    setQuestions(q);
    setRevealed(Array(q.length).fill(false));
  }, [content, term]);

  const reveal = (i: number) => {
    setRevealed((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
  };

  if (!content) return null;

  return (
    <div className="rehearsal-panel">
      <h4>Rehearsal Questions</h4>
      <ol>
        {questions.map((q, i) => (
          <li key={i}>
            <p>{q.question}</p>
            {revealed[i] ? (
              <p className="answer">
                <strong>{q.answer}</strong> – {q.explanation}
              </p>
            ) : (
              <button onClick={() => reveal(i)}>Reveal</button>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
