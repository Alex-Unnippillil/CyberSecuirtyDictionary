import React from 'react';
import useSettings from '../hooks/useSettings';

/**
 * Accessibility settings section allowing users to reveal text labels under icons.
 */
export default function Accessibility() {
  const { settings, updateSetting } = useSettings();

  return (
    <div>
      <div
        id="icon-labels-toggle"
        data-setting-label="Always show icon labels"
        data-setting-keywords="accessibility,labels,icons"
      >
        <label>
          <input
            type="checkbox"
            checked={settings.showIconLabels}
            onChange={(e) => updateSetting('showIconLabels', e.target.checked)}
          />
          Always show text labels under icons
        </label>
      </div>
    </div>
  );
}
