import React, { useEffect, useRef } from "react";
import { useSearch } from "../../hooks/useSearch";

export const SearchBar: React.FC = () => {
  const { query, setQuery } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.addEventListener(
        "result",
        (e: SpeechRecognitionEvent) => {
          const transcript = e.results[0][0].transcript;
          setQuery(transcript);
        },
      );
    } else {
      // Web Speech API unsupported, focus the text input
      inputRef.current?.focus();
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    } else {
      inputRef.current?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  return (
    <div className="search-bar">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search terms..."
      />
      <button
        type="button"
        onClick={startListening}
        aria-label="Use microphone"
      >
        🎤
      </button>
    </div>
  );
};

export default SearchBar;
