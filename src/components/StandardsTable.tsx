import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface Column<T> {
  key: keyof T;
  label: string;
}

export interface StandardsTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  /**
   * Optional storage key used when persisting user preferences.
   * Defaults to "standardsTable".
   */
  storageKey?: string;
}

interface SortConfig<T> {
  key: keyof T | null;
  direction: 'asc' | 'desc';
}

/**
 * Interactive table used for presenting standards data. Allows the user to
 * control which columns are visible and provides clickable column headers for
 * sorting the table. User preferences are persisted in `localStorage` so they
 * remain between sessions.
 */
export function StandardsTable<T extends Record<string, any>>({
  data,
  columns,
  storageKey = 'standardsTable',
}: StandardsTableProps<T>) {
  const [visibleColumns, setVisibleColumns] = useState<(keyof T)[]>(
    columns.map((c) => c.key)
  );
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: null,
    direction: 'asc',
  });

  const columnKeys = useMemo(() => columns.map((c) => c.key), [columns]);

  // Load preferences on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.visibleColumns)) {
          const valid = parsed.visibleColumns.filter((k: keyof T) =>
            columnKeys.includes(k)
          );
          if (valid.length) setVisibleColumns(valid);
        }
        if (parsed.sortConfig && columnKeys.includes(parsed.sortConfig.key)) {
          setSortConfig(parsed.sortConfig);
        }
      }
    } catch {
      // ignore malformed data
    }
  }, [storageKey, columnKeys]);

  // Persist preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ visibleColumns, sortConfig })
      );
    } catch {
      // ignore write errors
    }
  }, [visibleColumns, sortConfig, storageKey]);

  const toggleColumn = useCallback((key: keyof T) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }, []);

  const requestSort = useCallback((key: keyof T) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  }, []);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    const { key, direction } = sortConfig;
    return [...data].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal === bVal) return 0;
      const order = aVal > bVal ? 1 : -1;
      return direction === 'asc' ? order : -order;
    });
  }, [data, sortConfig]);

  return (
    <div>
      <div className="standards-table__controls">
        {columns.map((col) => (
          <label key={String(col.key)} style={{ marginRight: '0.5rem' }}>
            <input
              type="checkbox"
              checked={visibleColumns.includes(col.key)}
              onChange={() => toggleColumn(col.key)}
            />
            {col.label}
          </label>
        ))}
      </div>
      <table className="standards-table">
        <thead>
          <tr>
            {columns.map((col) =>
              visibleColumns.includes(col.key) ? (
                <th
                  key={String(col.key)}
                  onClick={() => requestSort(col.key)}
                  style={{ cursor: 'pointer' }}
                  aria-sort={
                    sortConfig.key === col.key
                      ? sortConfig.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  {col.label}
                  {sortConfig.key === col.key
                    ? sortConfig.direction === 'asc'
                      ? ' ▲'
                      : ' ▼'
                    : null}
                </th>
              ) : null
            )}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) =>
                visibleColumns.includes(col.key) ? (
                  <td key={String(col.key)}>{String(row[col.key])}</td>
                ) : null
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StandardsTable;
