"use client";
import React, { useRef } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

/**
 * Basic search bar used across the application. It exposes a value and
 * change handler and forwards keyboard events to enable navigation in the
 * parent component.
 */
export function SearchBar({
  value,
  onChange,
  onKeyDown,
  placeholder,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <input
      ref={inputRef}
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder ?? "Search terms"}
      className="border px-3 py-2 rounded w-full"
      aria-label="Search terms"
    />
  );
}

export default SearchBar;
