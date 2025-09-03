import { NextResponse } from 'next/server';
import { MAX_UPLOAD_SIZE } from '../../../src/utils/limits';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export async function POST(request: Request) {
  const contentLength = request.headers.get('content-length');
  const size = contentLength ? parseInt(contentLength, 10) : 0;
  if (size > MAX_UPLOAD_SIZE) {
    return NextResponse.json(
      { error: `File is too large. Maximum size is ${Math.round(MAX_UPLOAD_SIZE / (1024 * 1024))} MB.` },
      { status: 400 },
    );
  }

  // For demonstration purposes, we simply consume the body to avoid 413 errors
  try {
    await request.arrayBuffer();
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to read upload.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
