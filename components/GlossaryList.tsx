import React from 'react';

interface Term {
  title: string;
  slug: string;
}

interface GlossaryListProps {
  /** Filters shown as selectable chips */
  filters: string[];
  /** Currently active filters */
  active: string[];
  /** Callback when a filter chip is clicked */
  onToggle: (filter: string) => void;
  /** Terms to display in the list */
  terms: Term[];
}

/**
 * Displays a list of glossary terms with filter chips that stay fixed to the
 * top of the viewport while scrolling. The sticky position accounts for the
 * device status bar and site header using safe-area insets and responsive
 * offsets.
 */
export default function GlossaryList({
  filters,
  active,
  onToggle,
  terms,
}: GlossaryListProps) {
  return (
    <div className="glossary-list">
      {/* Sticky filter chip bar */}
      <div
        className="sticky z-10 bg-white border-b flex gap-2 overflow-x-auto px-4 py-2 top-[calc(env(safe-area-inset-top)+3.5rem)] md:top-[calc(env(safe-area-inset-top)+4rem)]"
      >
        {filters.map((filter) => {
          const selected = active.includes(filter);
          return (
            <button
              key={filter}
              onClick={() => onToggle(filter)}
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm transition-colors duration-150 ${
                selected
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 text-gray-800 border-gray-300'
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Term list */}
      <ul className="divide-y">
        {terms.map((term) => (
          <li key={term.slug} className="p-4">
            <a href={`/term/${term.slug}`} className="text-blue-700 underline">
              {term.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

