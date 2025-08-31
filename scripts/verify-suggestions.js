const fs = require("fs");

const suggestions = JSON.parse(fs.readFileSync("suggestions.json", "utf8"));
const required = ["denial of service", "sql injection", "cross site scripting"];
const missing = required.filter((p) => !suggestions.includes(p));

if (missing.length) {
  console.error("Missing common suggestions:", missing.join(", "));
  process.exit(1);
} else {
  console.log("All common suggestions present.");
}
