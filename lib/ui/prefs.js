'use strict';
const STORAGE_KEY = 'user-prefs';
function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed ? parsed : {};
  } catch {
    return {};
  }
}
function savePrefs(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage errors (e.g. quota exceeded, unavailable)
  }
}
function getPref(key, fallback) {
  const prefs = loadPrefs();
  return Object.prototype.hasOwnProperty.call(prefs, key)
    ? prefs[key]
    : fallback;
}
function setPref(key, value) {
  const prefs = loadPrefs();
  prefs[key] = value;
  savePrefs(prefs);
}
function clearPrefs() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
module.exports = {
  loadPrefs,
  savePrefs,
  getPref,
  setPref,
  clearPrefs,
};
