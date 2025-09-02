'use client';

import React, { useState } from 'react';

interface TableBuilderProps {
  paragraphs: string[];
}

/**
 * Allows selecting multiple paragraphs and converting them into a two-column
 * table. Provides options to copy the table as CSV or Markdown and supports
 * undoing back to the original paragraph view.
 */
const TableBuilder: React.FC<TableBuilderProps> = ({ paragraphs }) => {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [tableData, setTableData] = useState<string[][] | null>(null);
  const [original] = useState<string[]>(paragraphs);

  const toggle = (index: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const convert = () => {
    const rows = Array.from(selected)
      .sort((a, b) => a - b)
      .map((idx) => {
        const text = original[idx];
        const [col1, col2 = ''] = text.split(/[:\-\u2013]\s*/);
        return [col1.trim(), col2.trim()];
      });
    setTableData(rows);
  };

  const copyCsv = async () => {
    if (!tableData) return;
    const csv = tableData
      .map((row) => row.map((c) => `"${c.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    await navigator.clipboard.writeText(csv);
  };

  const copyMd = async () => {
    if (!tableData) return;
    const header = '| Column 1 | Column 2 |\n| --- | --- |\n';
    const body = tableData.map(([a, b]) => `| ${a} | ${b} |`).join('\n');
    await navigator.clipboard.writeText(header + body);
  };

  const undo = () => {
    setTableData(null);
    setSelected(new Set());
  };

  return (
    <div>
      {tableData ? (
        <div>
          <table>
            <tbody>
              {tableData.map(([a, b], i) => (
                <tr key={i}>
                  <td>{a}</td>
                  <td>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '0.5rem' }}>
            <button onClick={copyCsv}>Copy CSV</button>
            <button onClick={copyMd} style={{ marginLeft: '0.5rem' }}>
              Copy Markdown
            </button>
            <button onClick={undo} style={{ marginLeft: '0.5rem' }}>
              Undo
            </button>
          </div>
        </div>
      ) : (
        <div>
          {original.map((text, idx) => (
            <p
              key={idx}
              onClick={() => toggle(idx)}
              style={{
                cursor: 'pointer',
                background: selected.has(idx) ? '#e0f2fe' : undefined,
              }}
            >
              {text}
            </p>
          ))}
          {selected.size > 0 && (
            <button onClick={convert}>Convert to Table</button>
          )}
        </div>
      )}
    </div>
  );
};

export default TableBuilder;

