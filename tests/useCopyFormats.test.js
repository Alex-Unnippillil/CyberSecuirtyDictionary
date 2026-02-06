require("ts-node/register");
const assert = require("assert").strict;
const logger = require("../src/utils/logger");
const useCopyFormats =
  require("../src/features/selection/useCopyFormats").default;

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

logger.info("useCopyFormats tests passed");
