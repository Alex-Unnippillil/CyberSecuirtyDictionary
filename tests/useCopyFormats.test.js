import { strict as assert } from 'node:assert';
import useCopyFormats from '../src/features/selection/useCopyFormats.ts';

const build = useCopyFormats();
const text = "Example text";
const heading = "Heading";
const url = "https://example.com/page#heading";

const formats = build(text, heading, url);

assert.equal(
  formats["text/plain"],
  "Example text\n\nHeading - https://example.com/page#heading",
);
assert.equal(
  formats["text/markdown"],
  "Example text\n\n[Heading](https://example.com/page#heading)",
);
assert.equal(
  formats["text/html"],
  '<blockquote>Example text</blockquote><p><a href="https://example.com/page#heading">Heading</a></p>',
);

console.log("useCopyFormats tests passed");
