import fs from 'node:fs/promises';
import path from 'node:path';
import { FeedbackRecord } from './types';

const feedbackFile = path.join(process.cwd(), 'feedback.json');

export async function listFeedback(): Promise<FeedbackRecord[]> {
  try {
    const raw = await fs.readFile(feedbackFile, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error: any) {
    if (error?.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

export async function addFeedback(input: { message: string; email?: string }): Promise<FeedbackRecord> {
  const feedback = await listFeedback();
  const created: FeedbackRecord = {
    message: input.message,
    email: input.email,
    timestamp: new Date().toISOString(),
  };

  feedback.push(created);
  await fs.writeFile(feedbackFile, JSON.stringify(feedback, null, 2), 'utf8');
  return created;
}
