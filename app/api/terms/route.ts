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

export async function GET() {
  try {
    const terms = await readTerms();
    return NextResponse.json(terms);
  } catch (error) {
    console.error('Failed to load terms', error);
    return NextResponse.json({ error: 'Failed to load terms' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { term, definition } = await request.json();
    if (!term || !definition) {
      return NextResponse.json(
        { error: 'term and definition are required' },
        { status: 400 }
      );
    }

    const terms = await readTerms();
    if (terms.some((t) => t.term === term)) {
      return NextResponse.json(
        { error: 'term already exists' },
        { status: 409 }
      );
    }

    terms.push({ term, definition });
    await writeTerms(terms);
    return NextResponse.json({ term, definition }, { status: 201 });
  } catch (error) {
    console.error('Failed to create term', error);
    return NextResponse.json({ error: 'Failed to create term' }, { status: 500 });
  }
}
