import React, { useState } from "react";
import {
  BackupData,
  exportData,
  getCurrentData,
  importData,
  parseBackup,
} from "@/src/utils/exportImport";
import DiffPreview from "./DiffPreview";

export default function ExportImport() {
  const [preview, setPreview] = useState<BackupData | null>(null);

  function handleExport() {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = parseBackup(String(reader.result));
        setPreview(data);
      } catch {
        alert("Invalid backup file");
      }
    };
    reader.readAsText(file);
  }

  function applyImport(data: BackupData) {
    importData(data);
    setPreview(null);
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      <h2>Backup</h2>
      <button onClick={handleExport}>Export</button>
      <label style={{ marginLeft: "0.5rem" }}>
        Import
        <input
          type="file"
          accept="application/json"
          onChange={handleFile}
          style={{ display: "none" }}
        />
      </label>
      {preview && (
        <DiffPreview
          current={getCurrentData()}
          incoming={preview}
          onConfirm={() => applyImport(preview)}
          onCancel={() => setPreview(null)}
        />
      )}
    </div>
  );
}
