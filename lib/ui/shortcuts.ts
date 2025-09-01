export function registerShortcuts(
  focusSearch: () => void,
  openHelp: () => void,
): () => void {
  function handler(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const isInput =
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable);
    if (isInput) return;

    if (event.key === "/") {
      event.preventDefault();
      focusSearch();
    } else if (event.key === "?" || (event.shiftKey && event.key === "/")) {
      event.preventDefault();
      openHelp();
    }
  }
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}
