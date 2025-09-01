import React from "react";

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

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value).catch(() => {
      /* ignore errors */
    });
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
                onClick={() => copyToClipboard(value)}
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
