import { NextResponse } from "next/server";
import data from "@/terms.json";

interface Term {
  term: string;
  definition: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() ?? "";

  const terms: Term[] = (data as any).terms || [];
  const results = terms.filter(
    (t) =>
      t.term.toLowerCase().includes(query) ||
      t.definition.toLowerCase().includes(query)
  );

  return NextResponse.json(results);
}
