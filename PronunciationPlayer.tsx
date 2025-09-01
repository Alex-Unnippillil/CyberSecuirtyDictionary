import React, { useRef, useState } from "react";

interface PronunciationPlayerProps {
  /**
   * List of audio sources to present to the user.
   * Each source gets its own play button.
   */
  sources: string[];
}

/**
 * PronunciationPlayer renders a set of play icons that each control a
 * corresponding audio element. Only one audio clip will play at a time and
 * clicking the active icon pauses playback.
 */
export const PronunciationPlayer: React.FC<PronunciationPlayerProps> = ({
  sources,
}) => {
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const [playing, setPlaying] = useState<boolean[]>(() =>
    sources.map(() => false),
  );

  const toggle = (index: number) => {
    const audio = audioRefs.current[index];
    if (!audio) return;

    if (audio.paused) {
      // Pause any other playing clips
      audioRefs.current.forEach((a, i) => {
        if (i !== index && a) {
          a.pause();
        }
      });
      setPlaying((prev) => prev.map((v, i) => (i === index ? true : false)));
      audio.play();
    } else {
      setPlaying((prev) => prev.map((v, i) => (i === index ? false : v)));
      audio.pause();
    }
  };

  return (
    <span className="pronunciation-player">
      {sources.map((src, idx) => (
        <span key={idx} className="pronunciation-source">
          <button type="button" onClick={() => toggle(idx)}>
            {playing[idx] ? "⏸" : "▶"}
          </button>
          <audio ref={(el) => (audioRefs.current[idx] = el)} src={src} />
        </span>
      ))}
    </span>
  );
};

export default PronunciationPlayer;
