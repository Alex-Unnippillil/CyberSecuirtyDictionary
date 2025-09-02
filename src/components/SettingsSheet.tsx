import React from "react";
import useSettings from "@src/hooks/useSettings";

/**
 * SettingsSheet renders toggle controls for each user setting.
 * All changes are persisted using the useSettings hook.
 */
export const SettingsSheet: React.FC = () => {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="settings-sheet">
      <h2>Settings</h2>
      <label>
        <input
          type="checkbox"
          checked={settings.darkMode}
          onChange={(e) => updateSetting("darkMode", e.target.checked)}
        />
        Dark mode
      </label>
      <label>
        <input
          type="checkbox"
          checked={settings.showFavorites}
          onChange={(e) => updateSetting("showFavorites", e.target.checked)}
        />
        Show favorites only
      </label>
    </div>
  );
};

export default SettingsSheet;
