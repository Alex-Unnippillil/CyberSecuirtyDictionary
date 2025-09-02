export type ReadingMode = "study" | "skim" | "deep-dive";

const STORAGE_KEY = "readingMode.mode";

const MODES: Record<
  ReadingMode,
  { accordion: "visible" | "hidden"; density: "comfortable" | "compact" }
> = {
  study: { accordion: "visible", density: "comfortable" },
  skim: { accordion: "hidden", density: "comfortable" },
  "deep-dive": { accordion: "visible", density: "compact" },
};

function applyMode(mode: ReadingMode) {
  const root = document.documentElement;
  const config = MODES[mode];

  root.classList.remove(
    "accordion-visible",
    "accordion-hidden",
    "density-comfortable",
    "density-compact",
  );
  root.classList.add(`accordion-${config.accordion}`);
  root.classList.add(`density-${config.density}`);
}

export function setReadingMode(mode: ReadingMode) {
  applyMode(mode);
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore
  }
}

export function initReadingMode(): ReadingMode {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  const mode: ReadingMode =
    (stored as ReadingMode) && stored in MODES
      ? (stored as ReadingMode)
      : "study";
  applyMode(mode);
  return mode;
}

export function getReadingMode(): ReadingMode {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  const mode: ReadingMode =
    (stored as ReadingMode) && stored in MODES
      ? (stored as ReadingMode)
      : "study";
  return mode;
}
