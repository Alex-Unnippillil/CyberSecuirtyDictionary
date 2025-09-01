import React from "react";
import ColorBlindPalette from "./ColorBlindPalette";
import ExportImport from "./ExportImport";

export default function SettingsPage() {
  return (
    <div>
      <h1>Settings</h1>
      <ColorBlindPalette />
      <ExportImport />
    </div>
  );
}
