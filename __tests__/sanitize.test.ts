const assert = require("assert");
const sanitize = require("../src/utils/sanitize").default;

const dirty =
  '<img src="x" onerror="alert(1)"><p>Hello</p><script>alert(1)</script>';
const clean = sanitize(dirty);

assert(!clean.includes("<script"), "script tags should be removed");
assert(!clean.includes("onerror"), "event handlers should be stripped");
assert(clean.includes("<p>Hello</p>"), "safe content should remain");

console.log("Sanitization test passed");
