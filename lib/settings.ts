import React, { createContext, useContext, useEffect, useState } from 'react';
import useBatterySaver from '../hooks/useBatterySaver';
import { safeParse } from '../src/utils/safeJson';

export type Settings = {
  darkMode: boolean;
  fontScale: number;
  density: 'comfortable' | 'compact';
  source: string;
  history: boolean;
  favorites: boolean;
  /**
   * Enables reduced data usage for features that load external resources.
   * Automatically toggled on by `useBatterySaver` when the device enters
   * a low-power state.
   */
  dataSaver: boolean;
  /**
   * Disables non-essential animations and transitions for a lighter
   * experience. Also controlled by `useBatterySaver`.
   */
  reducedMotion: boolean;
};

const defaultSettings: Settings = {
  darkMode: false,
  fontScale: 1,
  density: 'comfortable',
  source: 'all',
  history: true,
  favorites: true,
  dataSaver: false,
  reducedMotion: false,
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
    const raw = localStorage.getItem('settings');
    return raw
      ? { ...defaultSettings, ...safeParse<Partial<Settings>>(raw, {}) }
      : defaultSettings;
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
    root.classList.toggle('reduced-motion', settings.reducedMotion);
  }, [settings]);

  const update = (changes: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...changes }));
  };

  useBatterySaver(settings, update);

  return (
    <SettingsContext.Provider value={{ settings, update }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
