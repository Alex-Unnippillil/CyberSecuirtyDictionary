export const STORAGE_KEY = 'understandingStatus';

export interface UnderstandingRecord {
  [term: string]: {
    confidence: number;
  };
}

export function loadStatuses(): UnderstandingRecord {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UnderstandingRecord) : {};
  } catch {
    return {};
  }
}

export function saveStatus(term: string, confidence: number) {
  if (typeof window === 'undefined') return;
  const data = loadStatuses();
  data[term] = { confidence };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function removeStatus(term: string) {
  if (typeof window === 'undefined') return;
  const data = loadStatuses();
  delete data[term];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
