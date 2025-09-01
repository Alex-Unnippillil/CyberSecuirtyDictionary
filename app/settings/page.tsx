'use client';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.body.classList.toggle('dark', dark);
  }, [dark]);
  return (
    <main>
      <h1>Settings</h1>
      <label>
        <input
          type="checkbox"
          checked={dark}
          onChange={(e) => setDark(e.target.checked)}
        />
        Enable dark mode
      </label>
    </main>
  );
}
