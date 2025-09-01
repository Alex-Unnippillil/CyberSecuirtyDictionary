const express = require("express");
const { z } = require("zod");
const termsData = require("./terms.json");

const app = express();
app.use(express.json());

const terms = Array.isArray(termsData)
  ? termsData
  : Array.isArray(termsData.terms)
  ? termsData.terms
  : [];

function slugify(term) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const searchQuerySchema = z.object({ q: z.string().min(1) });

function scoreTerm(term, query) {
  let score = 0;
  const name = (term.term || "").toLowerCase();
  const def = (term.definition || "").toLowerCase();
  if (name.includes(query)) score += 3;
  if (def.includes(query)) score += 1;
  return score;
}

function snippet(definition, query) {
  const lower = definition.toLowerCase();
  const idx = lower.indexOf(query);
  if (idx === -1) {
    return definition.length > 120
      ? `${definition.slice(0, 120)}...`
      : definition;
  }
  const start = Math.max(0, idx - 20);
  const end = Math.min(definition.length, idx + query.length + 20);
  let snip = definition.slice(start, end);
  if (start > 0) snip = `...${snip}`;
  if (end < definition.length) snip = `${snip}...`;
  return snip;
}

app.get("/api/search", (req, res) => {
  const parsed = searchQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const q = parsed.data.q.toLowerCase();
  const results = terms
    .map((t) => {
      const sc = scoreTerm(t, q);
      if (sc <= 0) return null;
      return {
        slug: slugify(t.term || ""),
        title: t.term || "",
        snippet: snippet(t.definition || "", q),
        score: sc,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
  res.json(results);
});

const expandRequestSchema = z.object({ slug: z.string().min(1) });

app.post("/api/expand", (req, res) => {
  const parsed = expandRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { slug } = parsed.data;
  const term = terms.find((t) => slugify(t.term || "") === slug);
  if (!term) {
    return res.status(404).json({ error: "Not found" });
  }
  res.json({
    slug,
    title: term.term || "",
    definition: term.definition || "",
  });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;

