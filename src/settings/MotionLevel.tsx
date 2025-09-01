import React, { useEffect, useState } from "react";

interface Level {
  id: string;
  label: string;
  scale: number;
}

const levels: Level[] = [
  { id: "none", label: "No Motion", scale: 0 },
  { id: "reduced", label: "Reduced Motion", scale: 0.5 },
  { id: "full", label: "Full Motion", scale: 1 },
];

const storageKey = "motion-level";

export default function MotionLevel() {
  const [current, setCurrent] = useState<Level>(() => {
    const stored = localStorage.getItem(storageKey);
    return levels.find((l) => l.id === stored) || levels[2];
  });

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--motion-scale",
      String(current.scale),
    );
    localStorage.setItem(storageKey, current.id);
  }, [current]);

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => setCurrent(level)}
          style={{
            padding: "0.5rem",
            border:
              current.id === level.id ? "2px solid #000" : "1px solid #ccc",
            cursor: "pointer",
            textAlign: "center",
          }}
          aria-pressed={current.id === level.id}
        >
          <div
            style={{
              width: 20,
              height: 20,
              margin: "0 auto 0.25rem",
              borderRadius: "50%",
              background: "#007bff",
              animation:
                level.scale === 0
                  ? "none"
                  : `spin ${level.scale}s linear infinite`,
            }}
          />
          <span>{level.label}</span>
        </button>
      ))}
    </div>
  );
}
