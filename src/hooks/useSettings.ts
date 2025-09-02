import { useState, useCallback, useEffect } from "react";

export type SettingKey = "darkMode" | "showFavorites" | "showIconLabels";

export interface Settings {
  darkMode: boolean;
  showFavorites: boolean;
  showIconLabels: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  darkMode: false,
  showFavorites: false,
  showIconLabels: false,
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

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.classList.toggle(
        "show-icon-labels",
        settings.showIconLabels,
      );
    }
  }, [settings.showIconLabels]);

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
