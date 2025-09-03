import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dataFile = path.join(process.cwd(), "terms.json");

interface Term {
  term: string;
  definition: string;
}

async function readTerms(): Promise<Term[]> {
  const data = await fs.readFile(dataFile, "utf8");
  const parsed = JSON.parse(data);
  return parsed.terms || [];
}

async function writeTerms(terms: Term[]): Promise<void> {
  const data = JSON.stringify({ terms }, null, 2);
  await fs.writeFile(dataFile, data);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawLimit = parseInt(searchParams.get("limit") ?? "50", 10);
  const rawOffset = parseInt(searchParams.get("offset") ?? "0", 10);
  const limit = Math.min(isNaN(rawLimit) ? 50 : rawLimit, 100);
  const offset = Math.max(isNaN(rawOffset) ? 0 : rawOffset, 0);

  const allTerms = await readTerms();
  let page = allTerms.slice(offset, offset + limit);

  const MAX_BYTES = 1024 * 1024; // 1MB
  let body = JSON.stringify(page);
  while (Buffer.byteLength(body) > MAX_BYTES && page.length > 0) {
    page = page.slice(0, -1);
    body = JSON.stringify(page);
  }

  return NextResponse.json(page);
}

export async function POST(request: Request) {
  const { term, definition } = await request.json();
  if (!term || !definition) {
    return NextResponse.json(
      { error: "term and definition are required" },
      { status: 400 }
    );
  }

  const terms = await readTerms();
  if (terms.some((t) => t.term === term)) {
    return NextResponse.json(
      { error: "term already exists" },
      { status: 409 }
    );
  }

  terms.push({ term, definition });
  await writeTerms(terms);
  return NextResponse.json({ term, definition }, { status: 201 });
}
