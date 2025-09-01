import React, { useEffect, useState } from "react";

interface RelatedWordsPanelProps {
  /**
   * Base URL for the embedding-backed API that returns related terms.
   * The endpoint should respond to GET requests like:
   *   /api/related?word=example
   * and return a JSON payload: { related: string[] }
   */
  endpoint?: string;
}

const RelatedWordsPanel: React.FC<RelatedWordsPanelProps> = ({
  endpoint = "/api/related",
}) => {
  const [currentWord, setCurrentWord] = useState<string>("");
  const [related, setRelated] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  // Determine which dictionary term is closest to the top of the viewport
  useEffect(() => {
    const handleScroll = () => {
      const items = Array.from(
        document.querySelectorAll<HTMLElement>(".dictionary-item"),
      );
      let closest: HTMLElement | null = null;
      let minDistance = Infinity;

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const distance = Math.abs(rect.top);
        if (distance < minDistance) {
          minDistance = distance;
          closest = item;
        }
      });

      const word = closest?.querySelector("h3")?.textContent || "";
      if (word && word !== currentWord) {
        setCurrentWord(word);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentWord]);

  // Fetch related words whenever the current word changes
  useEffect(() => {
    if (!currentWord) return;

    const controller = new AbortController();

    const fetchRelated = async () => {
      try {
        const res = await fetch(
          `${endpoint}?word=${encodeURIComponent(currentWord)}`,
          {
            signal: controller.signal,
          },
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const data = (await res.json()) as { related: string[] };
        setRelated(data.related);
        setError("");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Unable to load related words");
          setRelated([]);
        }
      }
    };

    fetchRelated();
    return () => controller.abort();
  }, [currentWord, endpoint]);

  return (
    <aside className="related-words-panel">
      <h4>Related Terms</h4>
      {error && <p className="error">{error}</p>}
      {!error && (
        <ul>
          {related.length > 0 ? (
            related.map((word) => <li key={word}>{word}</li>)
          ) : (
            <li>No related terms found</li>
          )}
        </ul>
      )}
    </aside>
  );
};

export default RelatedWordsPanel;
