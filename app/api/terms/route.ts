import { apiError, apiJson, apiOptions } from "../_lib/http";
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
  const terms = await readTerms();
  return apiJson(terms);
}

export async function POST(request: Request) {
  const { term, definition } = await request.json();
  if (!term || !definition) {
    return apiError("term and definition are required", 400);
  }

  const terms = await readTerms();
  if (terms.some((t) => t.term === term)) {
    return apiError("term already exists", 409);
  }

  terms.push({ term, definition });
  await writeTerms(terms);
  return apiJson({ term, definition }, 201);
}


export function OPTIONS() {
  return apiOptions();
}
