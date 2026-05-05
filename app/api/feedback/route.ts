import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { errorResponse } from '../../../lib/api/errors';
import { feedbackSchema } from '../../../lib/schemas/api-schemas';
import { appendAuditLog } from '../../../lib/storage/audit-storage';
import { addFeedback } from '../../../lib/storage/feedback-storage';

export async function POST(request: NextRequest) {
  try {
    const parsed = feedbackSchema.safeParse(await request.json());
    if (!parsed.success) {
      return errorResponse(400, 'VALIDATION_ERROR', 'Invalid feedback payload.', parsed.error.flatten());
    }

    const saved = await addFeedback(parsed.data);
    const actor = request.headers.get('x-actor') || 'anonymous';

    await appendAuditLog({
      actor,
      action: 'feedback.create',
      target: 'feedback',
      details: { hasEmail: Boolean(parsed.data.email) },
    });

    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error('Failed to save feedback', error);
    return errorResponse(500, 'INTERNAL_ERROR', 'Internal server error');
  }
}
