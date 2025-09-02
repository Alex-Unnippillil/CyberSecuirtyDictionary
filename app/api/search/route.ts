import { NextResponse } from "next/server";
import data from "../../../terms.json";
import { verifyOrigin, withCors, handleOptions } from "../cors";

interface Term {
  term: string;
  definition: string;
}

export async function OPTIONS(request: Request) {
  return handleOptions(request);
}

export async function GET(request: Request) {
  const blocked = verifyOrigin(request);
  if (blocked) return blocked;
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() ?? "";

  const terms: Term[] = (data as any).terms || [];
  const results = terms.filter(
    (t) =>
      t.term.toLowerCase().includes(query) ||
      t.definition.toLowerCase().includes(query),
  );

  return withCors(request, NextResponse.json(results));
}
