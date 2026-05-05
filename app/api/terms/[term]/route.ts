import { NextResponse } from "next/server";
import { errorResponse } from "../../../../lib/api/errors";
import { termUpdateSchema } from "../../../../lib/schemas/api-schemas";
import { appendAuditLog } from "../../../../lib/storage/audit-storage";
import { deleteTerm, updateTerm } from "../../../../lib/storage/terms-storage";
import type { NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { term: string } }
) {
  const parsed = termUpdateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return errorResponse(400, "VALIDATION_ERROR", "Invalid term update payload.", parsed.error.flatten());
  }

  const headerVersion = request.headers.get("if-match");
  const expectedVersion = parsed.data.expectedVersion ?? (headerVersion ? Number(headerVersion) : undefined);

  try {
    const updated = await updateTerm(params.term, {
      definition: parsed.data.definition,
      expectedVersion,
    });
    await appendAuditLog({
      actor: request.headers.get("x-actor") || "api-key-client",
      action: "term.update",
      target: params.term,
      details: { previousExpectedVersion: expectedVersion, newVersion: updated.version },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error?.message === "TERM_NOT_FOUND") {
      return errorResponse(404, "NOT_FOUND", "Term not found.");
    }
    if (error?.message === "VERSION_CONFLICT") {
      return errorResponse(409, "VERSION_CONFLICT", "Version mismatch. Refresh and retry with the latest version.");
    }

    console.error("Failed to update term", error);
    return errorResponse(500, "INTERNAL_ERROR", "Internal server error");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { term: string } }
) {
  try {
    const removed = await deleteTerm(params.term);
    await appendAuditLog({
      actor: request.headers.get("x-actor") || "api-key-client",
      action: "term.delete",
      target: params.term,
      details: { removedVersion: removed.version },
    });
    return NextResponse.json(removed);
  } catch (error: any) {
    if (error?.message === "TERM_NOT_FOUND") {
      return errorResponse(404, "NOT_FOUND", "Term not found.");
    }
    console.error("Failed to delete term", error);
    return errorResponse(500, "INTERNAL_ERROR", "Internal server error");
  }
}
