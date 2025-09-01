export interface PromptChip {
  /** Tag associated with this chip */
  tag: string;
  /** Text displayed in the UI */
  label: string;
  /** Prompt text sent to the AI provider */
  prompt: string;
}

// Map of known tags to prompt chips that should be offered to the user.
// Tags can originate from the current dictionary term or user selection.
// Each tag maps to one or more chips containing helpful prompt templates.
export const TAG_PROMPTS: Record<string, PromptChip[]> = {
  // Basic explanation prompts
  explain: [
    { tag: 'explain', label: 'Explain simply', prompt: 'Explain this topic in simple terms.' },
    { tag: 'explain', label: 'Why it matters', prompt: 'Describe why this topic is important.' }
  ],
  // Provide an analogy to aid understanding
  analogy: [
    { tag: 'analogy', label: 'Give an analogy', prompt: 'Provide a real-world analogy.' }
  ],
  // Security focused prompts
  security: [
    { tag: 'security', label: 'Mitigation', prompt: 'How can this be mitigated or prevented?' },
    { tag: 'security', label: 'Examples', prompt: 'Give practical security examples.' }
  ]
};

/**
 * Return all prompt chips for a set of tags. Duplicates (same label/prompt) are removed.
 */
export function chipsForTags(tags: string[]): PromptChip[] {
  const byPrompt = new Map<string, PromptChip>();
  for (const tag of tags) {
    const chips = TAG_PROMPTS[tag];
    if (!chips) continue;
    for (const chip of chips) {
      byPrompt.set(chip.prompt, chip);
    }
  }
  return Array.from(byPrompt.values());
}
