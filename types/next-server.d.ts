declare module 'next/server' {
  export class NextResponse extends Response {
    constructor(body?: BodyInit | null, init?: ResponseInit);
    static json(data: unknown, init?: ResponseInit): NextResponse;
    static next(): NextResponse;
  }

  export interface NextRequest extends Request {
    nextUrl: URL;
  }
}
