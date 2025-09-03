import React, { useState } from "react";
import sanitize from "../../utils/sanitize";

const FLAG_OPTIONS = ["g", "i", "m", "s", "u", "y"] as const;
type Flag = (typeof FLAG_OPTIONS)[number];

function escapeHtml(str: string): string {
  return str.replace(/[&<>]/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      default:
        return c;
    }
  });
}

export default function RegexSandbox() {
  const [pattern, setPattern] = useState("");
  const [tests, setTests] = useState("");
  const [flags, setFlags] = useState<Record<Flag, boolean>>({
    g: false,
    i: false,
    m: false,
    s: false,
    u: false,
    y: false,
  });

  const toggleFlag = (flag: Flag) =>
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));

  const activeFlags = FLAG_OPTIONS.filter((f) => flags[f]).join("");

  let regex: RegExp | null = null;
  let regexError: string | null = null;
  try {
    regex = new RegExp(pattern, activeFlags);
  } catch (err) {
    regexError = (err as Error).message;
  }

  const results = tests.split(/\n/).map((line) => {
    if (!line) {
      return { line, match: false, highlighted: "", error: "" };
    }
    if (!regex) {
      return {
        line,
        match: false,
        highlighted: escapeHtml(line),
        error: regexError ?? "Invalid regex",
      };
    }
    const matches = [...line.matchAll(regex)];
    if (matches.length === 0) {
      return {
        line,
        match: false,
        highlighted: escapeHtml(line),
        error: "No match",
      };
    }
    let lastIndex = 0;
    let highlighted = "";
    matches.forEach((m) => {
      const start = m.index ?? 0;
      const end = start + m[0].length;
      highlighted += `${escapeHtml(line.slice(lastIndex, start))}<span style="background-color:#b2f5b2;">${escapeHtml(m[0])}</span>`;
      lastIndex = end;
    });
    highlighted += escapeHtml(line.slice(lastIndex));
    return { line, match: true, highlighted, error: "" };
  });

  return (
    <div>
      <div>
        <label>
          Pattern:
          <input value={pattern} onChange={(e) => setPattern(e.target.value)} />
        </label>
      </div>
      <div>
        Flags:
        {FLAG_OPTIONS.map((flag) => (
          <label key={flag} style={{ marginRight: "0.5rem" }}>
            <input
              type="checkbox"
              checked={flags[flag]}
              onChange={() => toggleFlag(flag)}
            />
            {flag}
          </label>
        ))}
      </div>
      <div>
        <label>
          Test Strings:
          <textarea
            rows={6}
            value={tests}
            onChange={(e) => setTests(e.target.value)}
          />
        </label>
      </div>
      <div>
        {results.map((res, idx) => (
          <div key={idx} style={{ color: res.match ? "inherit" : "red" }}>
            <div
              dangerouslySetInnerHTML={{ __html: sanitize(res.highlighted) }}
            />
            {!res.match && res.error && <small>{res.error}</small>}
          </div>
        ))}
      </div>
    </div>
  );
}
