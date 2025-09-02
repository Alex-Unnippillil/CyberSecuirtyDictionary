'use client';

import React, { useMemo, useState } from 'react';
import SplitView from './SplitView';

export interface RelationTerm {
  term: string;
  related: string[];
  domain?: string;
}

export interface RelationMatrixProps {
  terms: RelationTerm[];
}

/**
 * Displays a matrix showing relationships between terms. Rows and columns
 * represent terms. A filled cell indicates that the row term lists the column
 * term as related. Rows or columns are highlighted on hover and clicking a
 * cell opens the two terms in a split view for side-by-side comparison.
 */
export default function RelationMatrix({ terms }: RelationMatrixProps) {
  const [domain, setDomain] = useState('all');
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const [selected, setSelected] = useState<{ a: string; b: string } | null>(
    null,
  );

  // Unique domains for filter dropdown
  const domains = useMemo(() => {
    const set = new Set<string>();
    for (const t of terms) {
      if (t.domain) set.add(t.domain);
    }
    return Array.from(set);
  }, [terms]);

  // Terms after applying domain filter
  const filtered = useMemo(() => {
    return domain === 'all' ? terms : terms.filter((t) => t.domain === domain);
  }, [terms, domain]);

  const names = useMemo(() => filtered.map((t) => t.term), [filtered]);

  const resetHover = () => {
    setHoverRow(null);
    setHoverCol(null);
  };

  const handleCellClick = (a: string, b: string) => {
    setSelected({ a, b });
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Domain:{' '}
          <select value={domain} onChange={(e) => setDomain(e.target.value)}>
            <option value="all">All</option>
            {domains.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
      </div>
      <table
        style={{ borderCollapse: 'collapse' }}
        onMouseLeave={resetHover}
        className="relation-matrix"
      >
        <thead>
          <tr>
            <th />
            {names.map((name, colIdx) => (
              <th
                key={name}
                onMouseEnter={() => setHoverCol(colIdx)}
                style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: hoverCol === colIdx ? '#eef' : undefined,
                }}
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((row, rowIdx) => (
            <tr
              key={row.term}
              onMouseEnter={() => setHoverRow(rowIdx)}
              style={{
                backgroundColor: hoverRow === rowIdx ? '#f5f5ff' : undefined,
              }}
            >
              <th style={{ textAlign: 'left', padding: '0.25rem 0.5rem' }}>
                {row.term}
              </th>
              {names.map((col, colIdx) => {
                const related = row.related.some(
                  (r) => r.toLowerCase() === col.toLowerCase(),
                );
                const isHighlighted =
                  hoverRow === rowIdx || hoverCol === colIdx;
                return (
                  <td
                    key={col}
                    onMouseEnter={() => {
                      setHoverRow(rowIdx);
                      setHoverCol(colIdx);
                    }}
                    onClick={() => handleCellClick(row.term, col)}
                    style={{
                      cursor: 'pointer',
                      textAlign: 'center',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: isHighlighted ? '#e0e7ff' : undefined,
                    }}
                  >
                    {related ? '●' : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {selected ? (
        <SplitView
          termA={selected.a}
          termB={selected.b}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </div>
  );
}

