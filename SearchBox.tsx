import React, { useState } from "react";

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleMicClick = () => {
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser.");
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setError(null);
      };
      recognition.onerror = () => {
        setError("Unable to process speech.");
      };
      recognition.start();
    } catch (err) {
      console.error(err);
      setError("Could not access microphone.");
    }
  };

  return (
    <div className="search-box">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search terms..."
      />
      <button
        type="button"
        onClick={handleMicClick}
        aria-label="Use voice search"
      >
        🎤
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
