'use client';

import React from 'react';
import { useSettings } from '../../../lib/settings';

const SettingsPage: React.FC = () => {
  const { settings, update } = useSettings();

  return (
    <main>
      <h1>Settings</h1>
      <section>
        <label>
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={(e) => update({ darkMode: e.target.checked })}
          />
          Dark mode
        </label>
      </section>
      <section>
        <label>
          Font scale
          <input
            type="range"
            min="0.8"
            max="1.5"
            step="0.1"
            value={settings.fontScale}
            onChange={(e) => update({ fontScale: parseFloat(e.target.value) })}
          />
        </label>
      </section>
      <section>
        <label>
          <input
            type="checkbox"
            checked={settings.density === 'compact'}
            onChange={(e) =>
              update({ density: e.target.checked ? 'compact' : 'comfortable' })
            }
          />
          Compact density
        </label>
      </section>
      <section>
        <label>
          Source preference
          <select
            value={settings.source}
            onChange={(e) => update({ source: e.target.value })}
          >
            <option value="all">All</option>
            <option value="official">Official</option>
            <option value="community">Community</option>
          </select>
        </label>
        </section>
        <section>
          <label>
            <input
              type="checkbox"
              checked={settings.dataSaver}
              onChange={(e) => update({ dataSaver: e.target.checked })}
            />
            Data saver
          </label>
        </section>
        <section>
          <label>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => update({ reducedMotion: e.target.checked })}
            />
            Reduced motion
          </label>
        </section>
        <section>
          <label>
            <input
              type="checkbox"
              checked={settings.history}
              onChange={(e) => update({ history: e.target.checked })}
            />
            Enable history
          </label>
        </section>
        <section>
          <label>
            <input
              type="checkbox"
              checked={settings.favorites}
              onChange={(e) => update({ favorites: e.target.checked })}
            />
            Enable favorites
          </label>
        </section>
    </main>
  );
};

export default SettingsPage;
