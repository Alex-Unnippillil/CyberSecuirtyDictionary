import { NextResponse } from 'next/server';
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
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save feedback', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

