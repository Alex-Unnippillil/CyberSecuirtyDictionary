import React, { useEffect, useRef, useState } from "react";

export interface PronunciationPlayerProps {
  /** URL of the pronunciation audio file */
  src: string;
}

const PronunciationPlayer: React.FC<PronunciationPlayerProps> = ({ src }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(1);

  // Create wavesurfer instance on mount
  useEffect(() => {
    let ws: any;
    (async () => {
      const WaveSurfer = (await import("wavesurfer.js")).default;
      if (!containerRef.current) return;
      ws = WaveSurfer.create({
        container: containerRef.current,
        height: 48,
        waveColor: "#a0aec0",
        progressColor: "#2d3748",
        cursorColor: "#2d3748",
        barWidth: 2,
        responsive: true,
      });
      wavesurferRef.current = ws;
      ws.on("finish", () => setIsPlaying(false));
      ws.load(src);
    })();
    return () => {
      ws?.destroy();
      wavesurferRef.current = null;
    };
  }, [src]);

  // Update playback rate when it changes
  useEffect(() => {
    wavesurferRef.current?.setPlaybackRate(rate);
  }, [rate]);

  const togglePlay = () => {
    const ws = wavesurferRef.current;
    if (!ws) return;
    ws.playPause();
    setIsPlaying(ws.isPlaying());
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRate(parseFloat(e.target.value));
  };

  return (
    <div className="pronunciation-player">
      <div ref={containerRef} />
      <div className="controls">
        <button type="button" onClick={togglePlay}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <label>
          Rate:
          <select value={rate} onChange={handleRateChange}>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default PronunciationPlayer;
