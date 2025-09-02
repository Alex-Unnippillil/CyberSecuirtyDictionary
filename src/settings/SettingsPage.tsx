import React, { useEffect, useRef, useState } from "react";
import ColorBlindPalette from "./ColorBlindPalette";
import {
  buildSettingsIndex,
  searchSettings,
  SettingEntry,
} from "../features/settings/SettingsIndex";

/**
 * Settings page with client side search. Results update as the user types and
 * selecting a result expands the relevant section and highlights the control.
 */
export default function SettingsPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<SettingEntry[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SettingEntry[]>([]);
  const [definitionContrast, setDefinitionContrast] = useState(false);

  useEffect(() => {
    if (rootRef.current) {
      indexRef.current = buildSettingsIndex(rootRef.current);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("definitionHighContrast") === "true";
    setDefinitionContrast(stored);
    if (stored) {
      document.body.classList.add("definition-high-contrast");
    }
  }, []);

  useEffect(() => {
    setResults(searchSettings(indexRef.current, query));
  }, [query]);

  const handleResultClick = (entry: SettingEntry): void => {
    const section = document.getElementById(
      entry.sectionId,
    ) as HTMLDetailsElement | null;
    if (section && section.tagName.toLowerCase() === "details") {
      section.open = true;
    }
    const el = document.getElementById(entry.id);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (el) {
      el.classList.add("setting-highlight");
      setTimeout(() => el.classList.remove("setting-highlight"), 2000);
    }
  };

  const handleContrastToggle = (checked: boolean): void => {
    setDefinitionContrast(checked);
    document.body.classList.toggle("definition-high-contrast", checked);
    localStorage.setItem("definitionHighContrast", String(checked));
  };

  return (
    <div ref={rootRef} className="settings-page">
      <style>{`.setting-highlight{outline:2px solid #0d6efd;}`}</style>
      <div className="settings-search">
        <input
          type="search"
          placeholder="Search settings"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {results.length > 0 && (
          <ul className="settings-search__results">
            {results.map((r) => (
              <li key={r.id}>
                <button type="button" onClick={() => handleResultClick(r)}>
                  {r.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <details id="appearance" data-setting-section>
        <summary>Appearance</summary>
        <div>
          <label htmlFor="palette">Color palette</label>
          <div
            id="palette"
            data-setting-label="Color palette"
            data-setting-keywords="color,theme,palette"
          >
            <ColorBlindPalette />
          </div>
        </div>
        <div>
          <label htmlFor="definition-contrast">Definition contrast</label>
          <div
            id="definition-contrast"
            data-setting-label="High contrast definitions"
            data-setting-keywords="contrast,definition,text"
          >
            <label>
              <input
                type="checkbox"
                checked={definitionContrast}
                onChange={(e) => handleContrastToggle(e.target.checked)}
              />
              Increase definition contrast
            </label>
          </div>
        </div>
      </details>
    </div>
  );
}
