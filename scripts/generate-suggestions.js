const fs = require("fs");

const termsData = JSON.parse(fs.readFileSync("terms.json", "utf8"));
const terms = Array.isArray(termsData) ? termsData : termsData.terms || [];

function tokenize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

const counts = {};
terms.forEach((t) => {
  const name = t.term || t.name || "";
  const words = tokenize(name);
  for (let n = 2; n <= 3; n++) {
    for (let i = 0; i <= words.length - n; i++) {
      const phrase = words.slice(i, i + n).join(" ");
      counts[phrase] = (counts[phrase] || 0) + 1;
    }
  }
});

const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
const suggestions = sorted.slice(0, 100).map(([phrase]) => phrase);

const required = ["denial of service", "sql injection", "cross site scripting"];
required.forEach((p) => {
  if (!suggestions.includes(p)) suggestions.push(p);
});

fs.writeFileSync("suggestions.json", JSON.stringify(suggestions, null, 2));
console.log(`Generated ${suggestions.length} suggestions`);
