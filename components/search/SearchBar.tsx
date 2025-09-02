"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { useSearchStore } from "../../lib/store";

export default function SearchBar() {
  const router = useRouter();
  const { query, setQuery } = useSearchStore();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    const trimmed = value.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <input
      type="text"
      placeholder="Search terms..."
      value={query}
      onChange={handleChange}
      aria-label="Search terms"
    />
  );
}
