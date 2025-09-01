export type Prefs = Record<string, unknown>;

const STORAGE_KEY = 'user-prefs';

/**
 * Load all preferences from localStorage. Any parse errors result
 * in an empty object so callers never have to handle exceptions.
 */
export function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed ? (parsed as Prefs) : {};
  } catch {
    return {};
  }
}

/**
 * Persist the provided preferences object to localStorage.
 * Errors are silently ignored to keep the UI responsive.
 */
export function savePrefs(prefs: Prefs): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage errors (e.g. quota exceeded, unavailable)
  }
}

/**
 * Retrieve a single preference value. If the preference is absent,
 * the optional fallback value is returned.
 */
export function getPref<T = unknown>(key: string, fallback?: T): T | undefined {
  const prefs = loadPrefs();
  return Object.prototype.hasOwnProperty.call(prefs, key)
    ? (prefs[key] as T)
    : fallback;
}

/**
 * Update a single preference value in localStorage. Existing
 * preferences are merged with the provided key/value pair.
 */
export function setPref<T = unknown>(key: string, value: T): void {
  const prefs = loadPrefs();
  (prefs as any)[key] = value;
  savePrefs(prefs);
}

/**
 * Remove all stored preferences.
 */
export function clearPrefs(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
