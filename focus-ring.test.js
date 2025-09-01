const fs = require("fs");

const css = fs.readFileSync("styles.css", "utf8");

const focusBlockPattern =
  /\.dictionary-item:focus,[\s\S]*?#scrollToTopBtn:focus\s*\{[^}]*outline[^}]*\}/m;
if (!focusBlockPattern.test(css)) {
  console.error("Missing focus ring styles");
  process.exit(1);
}

const forcedBlockPattern =
  /@media\s*\(forced-colors:\s*active\)\s*\{[\s\S]*?\.dictionary-item:focus,[\s\S]*?#scrollToTopBtn:focus\s*\{[^}]*ButtonText[^}]*\}[\s\S]*?\}/m;
if (!forcedBlockPattern.test(css)) {
  console.error("Missing high-contrast focus ring styles");
  process.exit(1);
}

console.log("Focus ring high-contrast test passed");
