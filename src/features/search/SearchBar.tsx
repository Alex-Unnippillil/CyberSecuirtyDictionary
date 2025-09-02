import React, { useEffect, useRef, useState } from 'react';

export interface SearchBarProps {
  onSearch?: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.addEventListener('result', (e: SpeechRecognitionEvent) => {
        const transcript = e.results[0][0].transcript;
        setQuery(transcript);
        onSearch?.(transcript);
      });
    } else {
      // Web Speech API unsupported, focus the text input
      inputRef.current?.focus();
    }
  }, [onSearch]);

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
    onSearch?.(value);
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
        className="icon-button"
      >
        🎤
      </button>
    </div>
  );
};

export default SearchBar;
