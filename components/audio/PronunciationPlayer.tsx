import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

type PronunciationPlayerProps = {
  src: string;
};

const PronunciationPlayer: React.FC<PronunciationPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    if (waveformRef.current && audioRef.current && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ccc",
        progressColor: "#555",
        height: 40,
        responsive: true,
        cursorWidth: 0,
        interact: false,
        backend: "MediaElement",
        media: audioRef.current,
      });

      wavesurferRef.current.on("finish", () => setIsPlaying(false));
    }

    return () => {
      wavesurferRef.current?.destroy();
      wavesurferRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRate = parseFloat(e.target.value);
    setRate(newRate);
    if (audioRef.current) audioRef.current.playbackRate = newRate;
    wavesurferRef.current?.setPlaybackRate(newRate);
  };

  return (
    <div className="pronunciation-player">
      <audio ref={audioRef} src={src} preload="auto" />
      <div ref={waveformRef} className="pronunciation-player__waveform" />
      <div className="pronunciation-player__controls">
        <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
        <label>
          Speed:
          <select value={rate} onChange={handleRateChange}>
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default PronunciationPlayer;
