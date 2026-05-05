import { apiError, apiJson, apiOptions } from '../_lib/http';
import { log } from '../_lib/logger';
import fs from 'node:fs/promises';
import path from 'node:path';

interface Feedback {
  message: string;
  email?: string;
  timestamp: string;
}

const feedbackFile = path.join(process.cwd(), 'feedback.json');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message: string | undefined = body.message?.trim();
    const email: string | undefined = body.email?.trim();

    if (!message) {
      return apiJson({ success: false, error: 'Message is required' }, 400);
    }

    let feedback: Feedback[] = [];
    try {
      const existing = await fs.readFile(feedbackFile, 'utf8');
      feedback = JSON.parse(existing);
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }

    const entry: Feedback = {
      message,
      email,
      timestamp: new Date().toISOString(),
    };

    feedback.push(entry);
    await fs.writeFile(feedbackFile, JSON.stringify(feedback, null, 2));

    return apiJson({ success: true });
  } catch (error) {
    log('error', 'Failed to save feedback', { error: error instanceof Error ? error.message : 'unknown' });
    return apiError('Internal server error', 500);
  }
}



export function OPTIONS() {
  return apiOptions();
}
