import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

type SelectionEntry = { id: string; timestamp: number };

interface SelectionContextValue {
  selected: SelectionEntry[];
  isSelected(id: string): boolean;
  toggle(id: string, opts?: { range?: string[] }): void;
  clear(): void;
  marqueeSelect(ids: string[]): void;
}

const SelectionContext = createContext<SelectionContextValue | undefined>(undefined);

const STORAGE_KEY = 'selection';
const EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

function loadFromStorage(): SelectionEntry[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (data.expires && Date.now() > data.expires) {
      sessionStorage.removeItem(STORAGE_KEY);
      return [];
    }
    return data.items ?? [];
  } catch {
    return [];
  }
}

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selected, setSelected] = useState<SelectionEntry[]>(() => loadFromStorage());
  const lastIdRef = useRef<string | null>(null);

  useEffect(() => {
    const payload = { items: selected, expires: Date.now() + EXPIRY_MS };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [selected]);

  const toggle = (id: string, opts?: { range?: string[] }) => {
    setSelected(prev => {
      let next = prev;
      if (opts?.range && lastIdRef.current) {
        const ids = opts.range;
        const start = ids.indexOf(lastIdRef.current);
        const end = ids.indexOf(id);
        if (start !== -1 && end !== -1) {
          const [from, to] = start < end ? [start, end] : [end, start];
          const rangeIds = ids.slice(from, to + 1);
          const idSet = new Set(prev.map(p => p.id));
          const timestamp = Date.now();
          rangeIds.forEach(rid => {
            if (!idSet.has(rid)) {
              idSet.add(rid);
              next = [...next, { id: rid, timestamp }];
            }
          });
          lastIdRef.current = id;
          return next;
        }
      }
      const existing = prev.find(p => p.id === id);
      if (existing) {
        return prev.filter(p => p.id !== id);
      }
      lastIdRef.current = id;
      return [...prev, { id, timestamp: Date.now() }];
    });
  };

  const clear = () => setSelected([]);

  const marqueeSelect = (ids: string[]) => {
    const timestamp = Date.now();
    setSelected(prev => {
      const idSet = new Set(prev.map(p => p.id));
      const additions = ids.filter(id => !idSet.has(id)).map(id => ({ id, timestamp }));
      return [...prev, ...additions];
    });
  };

  const value: SelectionContextValue = {
    selected,
    isSelected: id => selected.some(s => s.id === id),
    toggle,
    clear,
    marqueeSelect,
  };

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
};

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelection must be used within SelectionProvider');
  return ctx;
}

export default SelectionContext;
