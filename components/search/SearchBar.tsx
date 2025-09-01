'use client';

import * as React from 'react';
import * as Combobox from '@radix-ui/react-combobox';

interface Hit {
  term: string;
  definition: string;
}

export default function SearchBar() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<Hit[]>([]);

  React.useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setResults(data.hits || []))
      .catch(() => {});
    return () => controller.abort();
  }, [query]);

  return (
    <Combobox.Root open={open} onOpenChange={setOpen}>
      <Combobox.Trigger className="w-full">
        <Combobox.Input
          placeholder="Search terms..."
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        />
      </Combobox.Trigger>
      <Combobox.Content className="mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-md">
        {results.length === 0 ? (
          <div className="p-2 text-sm text-gray-500">No results</div>
        ) : (
          results.map((hit) => (
            <Combobox.Item
              key={hit.term}
              value={hit.term}
              className="cursor-pointer px-3 py-2 focus:bg-blue-100 focus:outline-none"
            >
              {hit.term}
            </Combobox.Item>
          ))
        )}
      </Combobox.Content>
    </Combobox.Root>
  );
}
