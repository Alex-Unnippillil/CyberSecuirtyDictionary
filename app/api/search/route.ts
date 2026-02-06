import { NextResponse } from "next/server";
import data from "../../../terms.json";
import {
  parseQuery,
  searchQuerySchema,
} from "../../../src/utils/queryParser";

interface Term {
  term: string;
  definition: string;
}

interface SearchResponse {
  results: Term[];
  suggestions: string[];
}

// Simple Levenshtein distance implementation for suggestion ranking
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: b.length + 1 }, () => []);

  for (let i = 0; i <= b.length; i++) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export async function GET(request: Request) {
  const parsed = parseQuery(request.url, searchQuerySchema);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters" },
      { status: 400 }
    );
  }
  const { q: query } = parsed.data;

  const terms: Term[] = (data as any).terms || [];

  const results = terms.filter(
    (t) =>
      t.term.toLowerCase().includes(query) ||
      t.definition.toLowerCase().includes(query)
  );
  const exact = terms.find((t) => t.term.toLowerCase() === query);

  let suggestions: string[] = [];
  if (!exact) {
    suggestions = terms
      .map((t) => ({ term: t.term, distance: levenshtein(query, t.term.toLowerCase()) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5)
      .map((s) => s.term);
  }

  return NextResponse.json({ results, suggestions } as SearchResponse);
}
