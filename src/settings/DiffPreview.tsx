import React from "react";
import { BackupData } from "@src/utils/exportImport";

interface DiffPreviewProps {
  current: BackupData;
  incoming: BackupData;
  onConfirm: () => void;
  onCancel: () => void;
}

function buildDiff(
  current: Record<string, string>,
  incoming: Record<string, string>,
) {
  const keys = new Set([...Object.keys(current), ...Object.keys(incoming)]);
  const changes: Array<{ key: string; before?: string; after?: string }> = [];
  keys.forEach((key) => {
    if (current[key] !== incoming[key]) {
      changes.push({ key, before: current[key], after: incoming[key] });
    }
  });
  return changes;
}

export default function DiffPreview({
  current,
  incoming,
  onConfirm,
  onCancel,
}: DiffPreviewProps) {
  const settingsDiff = buildDiff(current.settings, incoming.settings);
  const notesDiff = buildDiff(current.notes, incoming.notes);

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", marginTop: "1rem" }}>
      <h2>Preview Changes</h2>
      <section>
        <h3>Settings</h3>
        {settingsDiff.length === 0 ? (
          <p>No changes</p>
        ) : (
          <ul>
            {settingsDiff.map((d) => (
              <li key={d.key}>
                <strong>{d.key}</strong>: {d.before ?? "∅"} → {d.after ?? "∅"}
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h3>Notes</h3>
        {notesDiff.length === 0 ? (
          <p>No changes</p>
        ) : (
          <ul>
            {notesDiff.map((d) => (
              <li key={d.key}>
                <strong>{d.key}</strong>: {d.before ?? "∅"} → {d.after ?? "∅"}
              </li>
            ))}
          </ul>
        )}
      </section>
      <button onClick={onConfirm}>Apply</button>
      <button onClick={onCancel} style={{ marginLeft: "0.5rem" }}>
        Cancel
      </button>
    </div>
  );
}
