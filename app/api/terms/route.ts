import { NextResponse } from "next/server";
import { errorResponse } from "../../../lib/api/errors";
import { termCreateSchema } from "../../../lib/schemas/api-schemas";
import { appendAuditLog } from "../../../lib/storage/audit-storage";
import { createTerm, listTerms } from "../../../lib/storage/terms-storage";
import type { NextRequest } from "next/server";

export async function GET() {
  const terms = await listTerms();
  return NextResponse.json(terms);
}

export async function POST(request: NextRequest) {
  const parsed = termCreateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return errorResponse(400, "VALIDATION_ERROR", "Invalid term payload.", parsed.error.flatten());
  }

  try {
    const created = await createTerm(parsed.data);
    await appendAuditLog({
      actor: request.headers.get("x-actor") || "api-key-client",
      action: "term.create",
      target: parsed.data.term,
      details: { version: created.version },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    if (error?.message === "TERM_EXISTS") {
      return errorResponse(409, "TERM_EXISTS", "A term with this name already exists.");
    }

    console.error("Failed to create term", error);
    return errorResponse(500, "INTERNAL_ERROR", "Internal server error");
  }
}
