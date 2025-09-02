import React, { useEffect, useState } from "react";
import useSWR from "swr";

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

  const { data } = useSWR<{ related: string[] }>(
    currentWord ? `${endpoint}?word=${encodeURIComponent(currentWord)}` : null,
    {
      refreshInterval: 300000,
      onError: () => setError("Unable to load related words"),
      onSuccess: () => setError(""),
    },
  );

  const related = data?.related || [];

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
