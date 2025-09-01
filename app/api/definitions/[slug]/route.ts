import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

interface TermEntry {
  name: string;
  slug: string;
  definition: string;
  sources?: string[];
}

let cache: TermEntry[] | null = null;
function getTerms(): TermEntry[] {
  if (cache) return cache;
  const filePath = path.join(process.cwd(), "data", "terms.yaml");
  const file = fs.readFileSync(filePath, "utf8");
  cache = yaml.load(file) as TermEntry[];
  return cache;
}

const RATE_LIMIT = 60; // requests per minute per IP
const WINDOW = 60 * 1000;
const ipHits = new Map<string, { count: number; start: number }>();

function allowRequest(ip: string): boolean {
  const now = Date.now();
  const hit = ipHits.get(ip);
  if (!hit || now - hit.start > WINDOW) {
    ipHits.set(ip, { count: 1, start: now });
    return true;
  }
  if (hit.count >= RATE_LIMIT) {
    return false;
  }
  hit.count += 1;
  return true;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!allowRequest(ip)) {
    return new NextResponse("Too Many Requests", { status: 429, headers: corsHeaders });
  }

  const term = getTerms().find(t => t.slug === params.slug);
  if (!term) {
    return new NextResponse("Not Found", { status: 404, headers: corsHeaders });
  }

  const body = {
    term: term.name,
    definition: term.definition,
    sources: term.sources || []
  };

  return NextResponse.json(body, { headers: corsHeaders });
}
