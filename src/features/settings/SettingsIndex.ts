export interface SettingEntry {
  /** Unique DOM id of the control */
  id: string;
  /** Visible label for the setting */
  label: string;
  /** Keywords associated with the setting */
  keywords: string[];
  /** Id of the section containing the setting */
  sectionId: string;
}

/**
 * Build an index of all settings controls within the given root element.
 * Controls must declare `data-setting-label` and optionally `data-setting-keywords`.
 * The closest ancestor with `data-setting-section` is used as the section id.
 */
export function buildSettingsIndex(root: HTMLElement): SettingEntry[] {
  const elements = Array.from(
    root.querySelectorAll<HTMLElement>('[data-setting-label]')
  );

  return elements
    .filter((el) => el.id)
    .map((el) => {
      const label = el.dataset.settingLabel || '';
      const keywords = (el.dataset.settingKeywords || '')
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);
      const section = el.closest<HTMLElement>('[data-setting-section]');
      return {
        id: el.id,
        label,
        keywords,
        sectionId: section ? section.id : '',
      };
    });
}

/**
 * Search the settings index using a case-insensitive substring match.
 */
export function searchSettings(
  entries: SettingEntry[],
  query: string
): SettingEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return entries.filter((e) => {
    if (e.label.toLowerCase().includes(q)) return true;
    return e.keywords.some((k) => k.toLowerCase().includes(q));
  });
}
