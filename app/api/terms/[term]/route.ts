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

export async function PUT(
  request: Request,
  { params }: { params: { term: string } }
) {
  const { definition } = await request.json();
  const terms = await readTerms();
  const idx = terms.findIndex((t) => t.term === params.term);
  if (idx === -1) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  terms[idx].definition = definition;
  await writeTerms(terms);
  return NextResponse.json(terms[idx]);
}

export async function DELETE(
  request: Request,
  { params }: { params: { term: string } }
) {
  const terms = await readTerms();
  const idx = terms.findIndex((t) => t.term === params.term);
  if (idx === -1) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const removed = terms.splice(idx, 1)[0];
  await writeTerms(terms);
  return NextResponse.json(removed);
}
