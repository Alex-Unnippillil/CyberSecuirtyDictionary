import { safeParse } from './safeJson';

export interface BackupData {
  settings: Record<string, string>;
  notes: Record<string, string>;
}

const NOTES_PREFIX = "note-";

export function getCurrentData(): BackupData {
  const settings: Record<string, string> = {};
  const notes: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    const value = localStorage.getItem(key);
    if (value === null) continue;
    if (key.startsWith(NOTES_PREFIX)) {
      notes[key] = value;
    } else {
      settings[key] = value;
    }
  }
  return { settings, notes };
}

export function exportData(): string {
  return JSON.stringify(getCurrentData(), null, 2);
}

export function importData(data: BackupData): void {
  Object.entries(data.settings || {}).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });
  Object.entries(data.notes || {}).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });
}

export function parseBackup(json: string): BackupData {
  return safeParse<BackupData>(json, { settings: {}, notes: {} });
}
