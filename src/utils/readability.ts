export function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) {
    return 1;
  }
  // Remove silent suffixes
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/i, "");
  // Remove leading y
  word = word.replace(/^y/, "");
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

export function fleschKincaid(text: string): number {
  if (!text) {
    return 0;
  }
  const sentences = (text.match(/[.!?]+/g) || []).length || 1;
  const words = (text.match(/\b\w+\b/g) || []).length;
  if (words === 0) {
    return 0;
  }
  const syllables = (text.match(/\b\w+\b/g) || []).reduce((sum, w) => sum + countSyllables(w), 0);
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  // Clamp score to 0-100 for meter display
  return Math.max(0, Math.min(100, score));
}
