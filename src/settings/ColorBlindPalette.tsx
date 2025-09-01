import React, { useEffect, useState } from "react";

// Types for palette tokens and definitions
export type PaletteTokens = {
  "--color-bg": string;
  "--color-text": string;
  "--color-link": string;
  "--color-link-hover": string;
  "--color-card-bg": string;
  "--color-badge-bg": string;
  "--color-badge-text": string;
};

export interface Palette {
  id: string;
  label: string;
  tokens: PaletteTokens;
  swatches: Array<keyof PaletteTokens>;
}

// Utility functions for contrast calculation
function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  const num = parseInt(value, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function luminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrastRatio(fg: string, bg: string): number {
  const [r1, g1, b1] = hexToRgb(fg);
  const [r2, g2, b2] = hexToRgb(bg);
  const L1 = luminance(r1, g1, b1) + 0.05;
  const L2 = luminance(r2, g2, b2) + 0.05;
  return L1 > L2 ? L1 / L2 : L2 / L1;
}

function ensureContrast(tokens: PaletteTokens): void {
  const ratio = contrastRatio(tokens["--color-text"], tokens["--color-bg"]);
  if (ratio < 4.5) {
    throw new Error(`Contrast ratio ${ratio.toFixed(2)} is below 4.5`);
  }
  const badgeRatio = contrastRatio(
    tokens["--color-badge-text"],
    tokens["--color-badge-bg"],
  );
  if (badgeRatio < 4.5) {
    throw new Error(
      `Badge contrast ratio ${badgeRatio.toFixed(2)} is below 4.5`,
    );
  }
}

// Palette definitions
export const palettes: Palette[] = [
  {
    id: "default",
    label: "Default",
    tokens: {
      "--color-bg": "#f8f9fa",
      "--color-text": "#212529",
      "--color-link": "#0d6efd",
      "--color-link-hover": "#0a58ca",
      "--color-card-bg": "#ffffff",
      "--color-badge-bg": "#e9ecef",
      "--color-badge-text": "#212529",
    },
    swatches: ["--color-bg", "--color-link", "--color-text"],
  },
  {
    id: "deuteranopia",
    label: "Deuteranopia",
    tokens: {
      "--color-bg": "#ffffff",
      "--color-text": "#1a1a1a",
      "--color-link": "#1f77b4",
      "--color-link-hover": "#125f8f",
      "--color-card-bg": "#ffffff",
      "--color-badge-bg": "#f2f2f2",
      "--color-badge-text": "#1a1a1a",
    },
    swatches: ["--color-bg", "--color-link", "--color-text"],
  },
  {
    id: "tritanopia",
    label: "Tritanopia",
    tokens: {
      "--color-bg": "#ffffff",
      "--color-text": "#1a1a1a",
      "--color-link": "#77216f",
      "--color-link-hover": "#5a184d",
      "--color-card-bg": "#ffffff",
      "--color-badge-bg": "#f2f2f2",
      "--color-badge-text": "#1a1a1a",
    },
    swatches: ["--color-bg", "--color-link", "--color-text"],
  },
];

// Validate palettes for required contrast ratio
palettes.forEach((p) => ensureContrast(p.tokens));

export default function ColorBlindPalette() {
  const [current, setCurrent] = useState<Palette>(palettes[0]);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(current.tokens).forEach(([name, value]) => {
      root.style.setProperty(name, value);
    });
  }, [current]);

  return (
    <div>
      {palettes.map((palette) => (
        <button
          key={palette.id}
          onClick={() => setCurrent(palette)}
          style={{
            display: "inline-block",
            margin: "0.5rem",
            padding: "0.5rem",
            cursor: "pointer",
            border:
              current.id === palette.id ? "2px solid #000" : "1px solid #ccc",
          }}
        >
          <div>{palette.label}</div>
          <div style={{ display: "flex", marginTop: "0.25rem" }}>
            {palette.swatches.map((token) => (
              <span
                key={token}
                style={{
                  background: palette.tokens[token],
                  width: 20,
                  height: 20,
                  marginRight: 2,
                  border: "1px solid #ccc",
                  display: "inline-block",
                }}
              />
            ))}
          </div>
        </button>
      ))}
    </div>
  );
}
