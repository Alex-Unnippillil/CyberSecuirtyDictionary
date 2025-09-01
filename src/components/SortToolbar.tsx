import React, { useState, useEffect } from "react";

export type SortOption = "updated" | "difficulty" | "length" | "alphabetical";

interface SortToolbarProps {
  /**
   * A key unique to the section using this toolbar. The chosen sort order is
   * persisted to localStorage using this key, allowing different sections to
   * maintain their own sort preferences independently.
   */
  sectionKey: string;
  /**
   * Optional callback fired whenever the sort order changes.
   */
  onSortChange?: (sort: SortOption) => void;
}

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "updated", label: "Updated" },
  { value: "difficulty", label: "Difficulty" },
  { value: "length", label: "Length" },
  { value: "alphabetical", label: "Alphabetical" },
];

export const SortToolbar: React.FC<SortToolbarProps> = ({
  sectionKey,
  onSortChange,
}) => {
  const storageKey = `sort-${sectionKey}`;
  const [sort, setSort] = useState<SortOption>(() => {
    const stored = localStorage.getItem(storageKey) as SortOption | null;
    return stored ?? "updated";
  });

  useEffect(() => {
    localStorage.setItem(storageKey, sort);
    onSortChange?.(sort);
  }, [sort, storageKey, onSortChange]);

  return (
    <div className="sort-toolbar">
      <label>
        Sort by:
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
        >
          {OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default SortToolbar;

