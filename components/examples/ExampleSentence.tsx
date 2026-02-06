import React, { useState } from "react";
import copyToClipboard from "../../lib/copyToClipboard";

export interface ExampleSentenceProps {
  /** The example sentence to display */
  text: string;
  /** Optional citation to the sentence */
  citation?: string;
}

/**
 * Renders an example sentence with an optional citation toggle and copy button.
 */
export const ExampleSentence: React.FC<ExampleSentenceProps> = ({
  text,
  citation,
}) => {
  const [showCitation, setShowCitation] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(text);
      // eslint-disable-next-line no-alert
      alert("Example sentence copied");
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="example-sentence">
      <p>{text}</p>
      {citation && showCitation && <cite>{citation}</cite>}
      <div className="example-sentence__actions">
        {citation && (
          <label>
            <input
              type="checkbox"
              checked={showCitation}
              onChange={() => setShowCitation(!showCitation)}
            />
            Show citation
          </label>
        )}
        <button type="button" onClick={handleCopy}>
          Copy
        </button>
      </div>
    </div>
  );
};

export default ExampleSentence;
