import React from 'react';
import { useSelection } from './SelectionContext';

interface Props {
  onCompare(ids: string[]): void;
  onExport(ids: string[]): void;
}

export const SelectionToolbar: React.FC<Props> = ({ onCompare, onExport }) => {
  const { selected, clear } = useSelection();
  if (selected.length === 0) return null;
  const ids = selected.map(s => s.id);
  return (
    <div className="selection-toolbar">
      <span>{selected.length} selected</span>
      <button onClick={() => onCompare(ids)}>Compare</button>
      <button onClick={() => onExport(ids)}>Export</button>
      <button onClick={clear}>Clear</button>
    </div>
  );
};
