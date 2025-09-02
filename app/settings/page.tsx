"use client";

import { useState, useEffect } from "react";
import PersonalTermsManager from "../../components/PersonalTermsManager";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState("medium");
  const [density, setDensity] = useState("comfortable");
  const [preferredSources, setPreferredSources] = useState<string[]>([]);
  const [enhancedHinting, setEnhancedHinting] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDarkMode(parsed.darkMode ?? false);
        setFontSize(parsed.fontSize ?? "medium");
        setDensity(parsed.density ?? "comfortable");
        setPreferredSources(parsed.preferredSources ?? []);
        setEnhancedHinting(parsed.enhancedHinting ?? true);
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    const data = { darkMode, fontSize, density, preferredSources, enhancedHinting };
    localStorage.setItem("settings", JSON.stringify(data));
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.style.fontSize =
      fontSize === "small" ? "14px" : fontSize === "large" ? "18px" : "16px";
    window.dispatchEvent(new Event("storage"));
  }, [darkMode, fontSize, density, preferredSources, enhancedHinting]);

  const toggleSource = (src: string) => {
    setPreferredSources((prev) =>
      prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src],
    );
  };

  return (
    <main className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <section>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
          Dark mode
        </label>
      </section>

      <section>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={enhancedHinting}
            onChange={(e) => setEnhancedHinting(e.target.checked)}
          />
          Enhanced font hinting
        </label>
      </section>

      <section>
        <label className="flex flex-col gap-2">
          <span>Font size</span>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </label>
      </section>

      <section>
        <label className="flex flex-col gap-2">
          <span>Density</span>
          <select value={density} onChange={(e) => setDensity(e.target.value)}>
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </select>
        </label>
      </section>

      <section className="space-y-2">
        <div>Preferred sources</div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={preferredSources.includes("internal")}
            onChange={() => toggleSource("internal")}
          />
          Internal
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={preferredSources.includes("external")}
            onChange={() => toggleSource("external")}
          />
          External
        </label>
      </section>

      <PersonalTermsManager />
    </main>
  );
}
