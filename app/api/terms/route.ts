import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { parseQuery, emptyQuerySchema } from "../../../src/utils/queryParser";

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
  const parsed = parseQuery(request.url, emptyQuerySchema);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Unexpected query parameters" },
      { status: 400 }
    );
  }
  const terms = await readTerms();
  return NextResponse.json(terms);
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
