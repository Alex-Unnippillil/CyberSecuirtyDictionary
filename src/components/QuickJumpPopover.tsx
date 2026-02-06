import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import useHotkeys from "../hooks/useHotkeys";

interface Heading {
  id: string;
  text: string;
  element: HTMLElement;
}

const selectors =
  'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

function findFirstInteractive(root: HTMLElement): HTMLElement | null {
  return root.matches(selectors)
    ? root
    : root.querySelector<HTMLElement>(selectors);
}

const QuickJumpPopover: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6"),
    );
    const list = nodes.map((el, i) => ({
      id: el.id || `quickjump-${i}`,
      text: el.textContent || `Heading ${i + 1}`,
      element: el,
    }));
    setHeadings(list);
  }, []);

  const hotkeys = useMemo(
    () => ({
      "alt+shift+j": (e: KeyboardEvent) => {
        e.preventDefault();
        setOpen((o) => !o);
      },
      escape: () => setOpen(false),
    }),
    [],
  );

  useHotkeys("quick-jump", hotkeys);

  const jumpTo = (heading: Heading) => {
    setOpen(false);
    heading.element.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      const target =
        findFirstInteractive(heading.element) ||
        (heading.element.nextElementSibling
          ? findFirstInteractive(
              heading.element.nextElementSibling as HTMLElement,
            )
          : null);
      target?.focus({ preventScroll: true });
    }, 500);
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        background: "#fff",
        border: "1px solid #ccc",
        padding: "0.5rem",
        zIndex: 1000,
        maxHeight: "80vh",
        overflow: "auto",
      }}
    >
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {headings.map((h) => (
          <li key={h.id}>
            <button
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                padding: "0.25rem 0.5rem",
                cursor: "pointer",
              }}
              onClick={() => jumpTo(h)}
            >
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuickJumpPopover;

export function mountQuickJumpPopover(): void {
  const container = document.createElement("div");
  document.body.appendChild(container);
  ReactDOM.render(<QuickJumpPopover />, container);
}

if (typeof document !== "undefined") {
  mountQuickJumpPopover();
}
