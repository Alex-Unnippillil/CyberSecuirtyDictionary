import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const windowRef: any =
  typeof (globalThis as any).window === "undefined"
    ? new JSDOM("").window
    : (globalThis as any).window;
const DOMPurify = createDOMPurify(windowRef);

export default function sanitize(dirty: string): string {
  return DOMPurify.sanitize(dirty);
}
