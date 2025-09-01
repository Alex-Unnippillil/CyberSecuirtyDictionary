export interface SettingsEntry {
  id: string;
  label: string;
  keywords: string[];
  element: HTMLElement;
}

/**
 * Build a search index for all settings controls inside the provided root.
 * Each setting is expected to have the attribute `data-setting` and may
 * optionally declare a comma separated list of keywords with `data-keywords`.
 */
export function indexSettings(root: HTMLElement): SettingsEntry[] {
  const items: SettingsEntry[] = [];
  root.querySelectorAll<HTMLElement>("[data-setting]").forEach((el) => {
    const labelEl = el.querySelector("label");
    const label = labelEl ? (labelEl.textContent || "").trim() : "";
    const keywordsAttr = el.getAttribute("data-keywords") || "";
    const keywords = keywordsAttr
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);
    items.push({ id: el.id, label, keywords, element: el });
  });
  return items;
}
