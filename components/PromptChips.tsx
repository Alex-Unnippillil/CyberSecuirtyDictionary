"use client";
import React from "react";

interface PromptChipsProps {
  prompts: string[];
  onSelect?: (prompt: string) => void;
}

/** Displays prompts as selectable chips. */
export function PromptChips({ prompts, onSelect }: PromptChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((p) => (
        <button
          key={p}
          onClick={() => onSelect?.(p)}
          className="bg-gray-200 rounded-full px-3 py-1 text-sm hover:bg-gray-300"
        >
          {p}
        </button>
      ))}
    </div>
  );
}

export default PromptChips;
