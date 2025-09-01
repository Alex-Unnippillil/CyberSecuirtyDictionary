import { useState, useCallback } from "react";

export type SettingKey = "darkMode" | "showFavorites";

export interface Settings {
  darkMode: boolean;
  showFavorites: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  darkMode: false,
  showFavorites: false,
};

const STORAGE_KEY = "settings";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_SETTINGS;
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw
        ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
        : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const updateSetting = useCallback(
    <K extends SettingKey>(key: K, value: Settings[K]) => {
      setSettings((prev) => {
        const next = { ...prev, [key]: value };
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore storage errors */
        }
        return next;
      });
    },
    [],
  );

  return { settings, updateSetting };
}

export default useSettings;
