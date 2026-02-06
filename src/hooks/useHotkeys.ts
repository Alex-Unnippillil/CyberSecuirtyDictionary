import { useEffect } from "react";

export type HotkeyHandler = (e: KeyboardEvent) => void;
export type HotkeyMap = Record<string, HotkeyHandler>;

const registry = new Map<string, HotkeyMap>();
let listening = false;

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable)
  );
}

function getCombo(e: KeyboardEvent): string {
  const parts: string[] = [];
  if (e.ctrlKey) parts.push("ctrl");
  if (e.metaKey) parts.push("meta");
  if (e.altKey) parts.push("alt");
  if (e.shiftKey) parts.push("shift");
  parts.push(e.key.toLowerCase());
  return parts.join("+");
}

function handleKeydown(e: KeyboardEvent) {
  if (isTypingTarget(e.target)) return;
  const combo = getCombo(e);
  registry.forEach((bindings) => {
    const fn = bindings[combo];
    if (fn) {
      fn(e);
    }
  });
}

/**
 * Register global keyboard shortcuts scoped by feature name.
 * Shortcuts are ignored when typing in inputs, textareas, or contentEditable elements.
 */
export function useHotkeys(feature: string, bindings: HotkeyMap) {
  useEffect(() => {
    registry.set(feature, bindings);
    if (!listening) {
      window.addEventListener("keydown", handleKeydown);
      listening = true;
    }
    return () => {
      registry.delete(feature);
      if (registry.size === 0 && listening) {
        window.removeEventListener("keydown", handleKeydown);
        listening = false;
      }
    };
  }, [feature, bindings]);
}

export default useHotkeys;

// Expose internals for testing
export const __hotkeysTest = {
  registry,
  handleKeydown,
};
