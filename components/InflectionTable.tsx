import React from "react";
import copyToClipboard from "../lib/copyToClipboard";

interface Entry {
  inflections?: Record<string, string>;
}

interface Props {
  entry: Entry;
}

export default function InflectionTable({ entry }: Props) {
  const { inflections } = entry;

  if (!inflections || Object.keys(inflections).length === 0) {
    return null;
  }

  const copyValue = async (value: string) => {
    try {
      await copyToClipboard(value);
    } catch {
      /* ignore errors */
    }
  };

  return (
    <table className="inflection-table">
      <tbody>
        {Object.entries(inflections).map(([label, value]) => (
          <tr key={label}>
            <th>{label}</th>
            <td>
              {value}
              <button
                type="button"
                onClick={() => copyValue(value)}
                aria-label={`Copy ${value}`}
              >
                Copy
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
