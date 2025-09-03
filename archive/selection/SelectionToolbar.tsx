import React from "react";
import { useSelection } from "./SelectionContext";
import useCopyFormats from "./useCopyFormats";

interface Props {
  onCompare(ids: string[]): void;
  onExport(ids: string[]): void;
}

export const SelectionToolbar: React.FC<Props> = ({ onCompare, onExport }) => {
  const { selected, clear } = useSelection();
  const buildFormats = useCopyFormats();
  if (selected.length === 0) return null;
  const ids = selected.map((s) => s.id);

  const copySelection = async () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === "") return;
    const text = selection.toString();
    const range = selection.getRangeAt(0);
    let node: Node | null = range.startContainer;
    let headingEl: HTMLElement | null = null;
    if (node instanceof HTMLElement) {
      headingEl = node.closest("h1,h2,h3,h4,h5,h6");
    } else if (node.parentElement) {
      headingEl = node.parentElement.closest("h1,h2,h3,h4,h5,h6");
    }
    if (!headingEl) {
      let el: HTMLElement | null = node.parentElement;
      while (el && !headingEl) {
        if (el.previousElementSibling) {
          const prev = el.previousElementSibling as HTMLElement;
          if (/^H[1-6]$/.test(prev.tagName)) {
            headingEl = prev;
            break;
          }
        }
        el = el.parentElement;
      }
    }
    const heading = headingEl?.textContent?.trim() || document.title;
    const id = headingEl?.id ? `#${headingEl.id}` : "";
    const url = `${window.location.origin}${window.location.pathname}${id}`;
    const formats = buildFormats(text, heading, url);
    const item = new ClipboardItem({
      "text/plain": new Blob([formats["text/plain"]], { type: "text/plain" }),
      "text/html": new Blob([formats["text/html"]], { type: "text/html" }),
      "text/markdown": new Blob([formats["text/markdown"]], {
        type: "text/markdown",
      }),
    } as any);
    await navigator.clipboard.write([item]);
  };

  return (
    <div className="selection-toolbar">
      <span>{selected.length} selected</span>
      <button onClick={() => onCompare(ids)}>Compare</button>
      <button onClick={() => onExport(ids)}>Export</button>
      <button onClick={copySelection}>Copy</button>
      <button onClick={clear}>Clear</button>
    </div>
  );
};
