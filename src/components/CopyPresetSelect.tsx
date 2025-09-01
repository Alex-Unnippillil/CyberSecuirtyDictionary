import React, { useEffect, useState } from "react";

export type Preset = "slack" | "markdown" | "html";

interface Props {
  onPresetChange?: (preset: Preset) => void;
}

const STORAGE_KEY = "copyPreset";

export const CopyPresetSelect: React.FC<Props> = ({ onPresetChange }) => {
  const [preset, setPreset] = useState<Preset>("slack");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Preset | null;
    if (stored) {
      setPreset(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, preset);
    onPresetChange?.(preset);
  }, [preset, onPresetChange]);

  return (
    <label
      style={{ display: "inline-flex", gap: "0.25rem", alignItems: "center" }}
    >
      Preset:
      <select
        value={preset}
        onChange={(e) => setPreset(e.target.value as Preset)}
        aria-label="Copy preset"
      >
        <option value="slack">Slack</option>
        <option value="markdown">Markdown</option>
        <option value="html">HTML</option>
      </select>
    </label>
  );
};

export default CopyPresetSelect;
