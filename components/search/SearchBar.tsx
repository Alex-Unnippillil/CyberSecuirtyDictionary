"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";

export default function SearchBar() {
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <input
      type="text"
      placeholder="Search terms..."
      onChange={handleChange}
      aria-label="Search terms"
    />
  );
}
