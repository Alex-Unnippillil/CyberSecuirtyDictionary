import { useEffect, useRef, useState } from 'react';

interface TextReaderProps {
  /**
   * Array of text sections to be read aloud. Each section can contain multiple sentences.
   */
  sections: string[];
}

/**
 * TextReader component uses the Web Speech API to read text aloud.
 * It provides controls for play/pause, playback speed and navigation between sections.
 * The current sentence being spoken is highlighted.
 */
export default function TextReader({ sections }: TextReaderProps) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [currentSentence, setCurrentSentence] = useState(0);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sentencesRef = useRef<string[]>([]);
  const boundariesRef = useRef<{ start: number; end: number }[]>([]);

  // Prepare sentences and boundaries when section changes
  useEffect(() => {
    const text = sections[sectionIndex] || '';
    sentencesRef.current = splitIntoSentences(text);

    // Pre-compute character boundaries for sentences
    boundariesRef.current = [];
    let count = 0;
    sentencesRef.current.forEach((sentence) => {
      const start = count;
      count += sentence.length;
      boundariesRef.current.push({ start, end: count });
      count += 1; // account for space
    });

    // Stop any ongoing speech when switching sections
    speechSynthesis.cancel();
    utteranceRef.current = null;
    setCurrentSentence(0);
    setIsPlaying(false);
  }, [sectionIndex, sections]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const splitIntoSentences = (text: string): string[] => {
    const matches = text.match(/[^.!?]+[.!?]+\s*/g);
    return matches ? matches.map((s) => s.trim()) : text ? [text] : [];
  };

  const handlePlay = () => {
    if (isPlaying) return;
    const utterance = new SpeechSynthesisUtterance(sections[sectionIndex]);
    utterance.rate = rate;

    utterance.onboundary = (e) => {
      const index = e.charIndex;
      const boundaryIndex = boundariesRef.current.findIndex(
        (b) => index >= b.start && index < b.end
      );
      if (boundaryIndex !== -1) {
        setCurrentSentence(boundaryIndex);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handlePause = () => {
    speechSynthesis.pause();
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else if (speechSynthesis.paused && utteranceRef.current) {
      speechSynthesis.resume();
      setIsPlaying(true);
    } else {
      handlePlay();
    }
  };

  const changeRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = parseFloat(e.target.value);
    setRate(newRate);
    if (utteranceRef.current) {
      utteranceRef.current.rate = newRate;
    }
  };

  const nextSection = () => {
    setSectionIndex((i) => Math.min(sections.length - 1, i + 1));
  };

  const prevSection = () => {
    setSectionIndex((i) => Math.max(0, i - 1));
  };

  return (
    <div>
      <div>
        {sentencesRef.current.map((sentence, idx) => (
          <span
            key={idx}
            className={idx === currentSentence ? 'tts-current-sentence' : undefined}
          >
            {sentence + ' '}
          </span>
        ))}
      </div>
      <div>
        <button onClick={handleTogglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
        <label style={{ marginLeft: '1em' }}>
          Speed
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={changeRate}
          />
        </label>
        <button onClick={prevSection} disabled={sectionIndex === 0} style={{ marginLeft: '1em' }}>
          Prev
        </button>
        <button
          onClick={nextSection}
          disabled={sectionIndex === sections.length - 1}
          style={{ marginLeft: '0.5em' }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

