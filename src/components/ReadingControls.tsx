import React, { useEffect, useState } from "react";

const FONT_SIZE_KEY = "readingControls.fontSize";
const LINE_HEIGHT_KEY = "readingControls.lineHeight";
const CONTENT_WIDTH_KEY = "readingControls.contentWidth";

const defaultValues = {
  fontSize: 16,
  lineHeight: 1.5,
  contentWidth: 800,
};

function setCssVar(variable: string, value: string) {
  document.documentElement.style.setProperty(variable, value);
}

export const ReadingControls: React.FC = () => {
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem(FONT_SIZE_KEY);
    return saved ? parseInt(saved, 10) : defaultValues.fontSize;
  });

  const [lineHeight, setLineHeight] = useState<number>(() => {
    const saved = localStorage.getItem(LINE_HEIGHT_KEY);
    return saved ? parseFloat(saved) : defaultValues.lineHeight;
  });

  const [contentWidth, setContentWidth] = useState<number>(() => {
    const saved = localStorage.getItem(CONTENT_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : defaultValues.contentWidth;
  });

  useEffect(() => {
    setCssVar("--font-size", `${fontSize}px`);
    localStorage.setItem(FONT_SIZE_KEY, String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    setCssVar("--line-height", `${lineHeight}`);
    localStorage.setItem(LINE_HEIGHT_KEY, String(lineHeight));
  }, [lineHeight]);

  useEffect(() => {
    setCssVar("--content-width", `${contentWidth}px`);
    localStorage.setItem(CONTENT_WIDTH_KEY, String(contentWidth));
  }, [contentWidth]);

  return (
    <div className="reading-controls">
      <label>
        Font Size
        <input
          type="range"
          min={12}
          max={24}
          step={1}
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
        />
      </label>
      <label>
        Line Height
        <input
          type="range"
          min={1}
          max={2}
          step={0.1}
          value={lineHeight}
          onChange={(e) => setLineHeight(parseFloat(e.target.value))}
        />
      </label>
      <label>
        Content Width
        <input
          type="range"
          min={400}
          max={1200}
          step={10}
          value={contentWidth}
          onChange={(e) => setContentWidth(parseInt(e.target.value, 10))}
        />
      </label>
    </div>
  );
};

export default ReadingControls;
