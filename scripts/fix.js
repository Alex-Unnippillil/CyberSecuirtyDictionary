#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const root = __dirname + "/..";

function titleCase(str) {
  return str
    .split(/(\s+)/)
    .map((word) => {
      if (/^\s+$/.test(word)) return word;
      if (word.toUpperCase() === word) return word; // acronyms
      if (/^[^a-zA-Z]+$/.test(word)) return word; // punctuation etc
      return word
        .split("-")
        .map((part) => {
          if (part.toUpperCase() === part) return part;
          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        })
        .join("-");
    })
    .join("");
}

function fixDefinition(def) {
  let d = def.replace(/\s+/g, " ").trim();
  d = d.replace(/\b[Cc]yber[ -]attack(s?)\b/g, (m, p1) =>
    m[0] === "C" ? `Cyberattack${p1}` : `cyberattack${p1}`,
  );
  if (!/[.!?]"?$/.test(d)) {
    d += ".";
  }
  return d;
}

function fixTerm(obj) {
  if (obj.term) obj.term = titleCase(obj.term);
  if (obj.name) obj.name = titleCase(obj.name);
  if (obj.category) obj.category = titleCase(obj.category);
  if (obj.synonyms) obj.synonyms = obj.synonyms.map(titleCase);
  if (obj.definition) obj.definition = fixDefinition(obj.definition);
  return obj;
}

// Fix terms.json
const jsonPath = path.join(root, "terms.json");
if (fs.existsSync(jsonPath)) {
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  if (Array.isArray(jsonData.terms)) {
    jsonData.terms = jsonData.terms.map(fixTerm);
    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2) + "\n");
  }
}
