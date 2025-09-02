"use client";

import useRecentTerms from "../../hooks/useRecentTerms";

export default function RecentTermTracker({ term }: { term: string }) {
  useRecentTerms(term);
  return null;
}
