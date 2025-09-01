import React, { useEffect, useState } from "react";

export type CopyPreset = "slack" | "markdown" | "html";

const STORAGE_KEY = "copy-preset";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function formatForPreset(
  content: string,
  preset: CopyPreset,
): { text: string; html: string } {
  const escaped = escapeHtml(content);
  switch (preset) {
    case "html":
      return {
        text: content,
        html: `<pre><code>${escaped}</code></pre>`,
      };
    case "markdown":
    case "slack":
    default:
      return {
        text: `\`\`\`\n${content}\n\`\`\``,
        html: `<pre><code>${escaped}</code></pre>`,
      };
  }
}

interface Props {
  onChange?(preset: CopyPreset): void;
}

export default function CopyPresetSelect({ onChange }: Props) {
  const [preset, setPreset] = useState<CopyPreset>("slack");

  useEffect(() => {
    const stored =
      typeof localStorage !== "undefined"
        ? (localStorage.getItem(STORAGE_KEY) as CopyPreset | null)
        : null;
    if (stored === "markdown" || stored === "html" || stored === "slack") {
      setPreset(stored);
      onChange?.(stored);
    }
  }, [onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as CopyPreset;
    setPreset(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore storage errors
    }
    onChange?.(value);
  };

  return (
    <select value={preset} onChange={handleChange} className="copy-preset-select">
      <option value="slack">Slack</option>
      <option value="markdown">Markdown</option>
      <option value="html">HTML</option>
    </select>
  );
}

