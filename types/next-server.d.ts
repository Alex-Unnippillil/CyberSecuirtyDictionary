/**
 * Local compatibility shim for non-Next.js tooling.
 * Required because this repository type-checks API route modules that import
 * `next/server`, while `next` is not installed in this package.
 */
declare module "next/server" {
  export class NextResponse extends Response {
    constructor(body?: BodyInit | null, init?: ResponseInit);
    static json(data: unknown, init?: ResponseInit): NextResponse;
    static next(init?: ResponseInit): NextResponse;
  }

  export interface NextRequest extends Request {
    nextUrl: URL;
  }
}
