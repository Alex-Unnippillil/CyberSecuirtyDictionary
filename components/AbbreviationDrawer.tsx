import React, { useEffect, useState } from "react";

interface AbbreviationItem {
  /** Abbreviation text */
  abbr: string;
  /** Definition associated with the abbreviation */
  definition: string;
  /** Element where the abbreviation first appears */
  element: Element;
}

/**
 * Collect abbreviations from the current document. The function looks for
 * explicit `<abbr>` tags as well as textual patterns like "Full Term (ABC)".
 */
function collectAbbreviations(): AbbreviationItem[] {
  const items: AbbreviationItem[] = [];
  const seen = new Set<string>();

  // `<abbr title="definition">ABC</abbr>`
  document.querySelectorAll<HTMLElement>("abbr[title]").forEach((el) => {
    const abbr = el.textContent?.trim();
    const definition = el.getAttribute("title") || "";
    if (abbr && !seen.has(abbr)) {
      items.push({ abbr, definition, element: el });
      seen.add(abbr);
    }
  });

  // Pattern: "Definition (ABC)"
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  );
  const regex = /([A-Za-z][A-Za-z\s]+?)\s*\(([A-Z]{2,})\)/g;
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    const text = node.textContent || "";
    regex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text))) {
      const definition = match[1].trim();
      const abbr = match[2];
      if (!seen.has(abbr)) {
        items.push({
          abbr,
          definition,
          element: node.parentElement || document.body,
        });
        seen.add(abbr);
      }
    }
  }

  return items;
}

/**
 * AbbreviationDrawer displays a list of abbreviations found on the page and
 * allows the user to scroll to the first occurrence of each one.
 */
const AbbreviationDrawer: React.FC = () => {
  const [items, setItems] = useState<AbbreviationItem[]>([]);

  useEffect(() => {
    setItems(collectAbbreviations());
  }, []);

  if (items.length === 0) return null;

  return (
    <aside className="abbr-drawer">
      <h2>Abbreviations</h2>
      <ul>
        {items.map((item) => (
          <li key={item.abbr}>
            <button
              type="button"
              className="abbr-drawer__link"
              onClick={() =>
                item.element.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                })
              }
            >
              <strong>{item.abbr}</strong> – {item.definition}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default AbbreviationDrawer;

