import React, { createContext, useContext, useEffect, useState } from 'react';

export type Settings = {
  darkMode: boolean;
  fontScale: number;
  density: 'comfortable' | 'compact';
  source: string;
  history: boolean;
  favorites: boolean;
};

const defaultSettings: Settings = {
  darkMode: false,
  fontScale: 1,
  density: 'comfortable',
  source: 'all',
  history: true,
  favorites: true,
};

type SettingsContextValue = {
  settings: Settings;
  update: (changes: Partial<Settings>) => void;
};

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  update: () => {},
});

function useLocalStorageSettings(): [Settings, React.Dispatch<React.SetStateAction<Settings>>] {
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window === 'undefined') return defaultSettings;
    try {
      const raw = localStorage.getItem('settings');
      return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  return [settings, setSettings];
}

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useLocalStorageSettings();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-scale', settings.fontScale.toString());
    root.style.setProperty('--density', settings.density);
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings]);

  const update = (changes: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...changes }));
  };

  return (
    <SettingsContext.Provider value={{ settings, update }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
