# Term Route Canonicalization Plan

## Canonical Rendering Stack

The canonical term-rendering stack is now:

- Route: `/term/[slug]`
- Renderer: `app/(site)/term/[slug]/page.tsx`
- Related/backlinks: `app/(site)/term/[slug]/RelatedTerms.tsx` (links to `/term/[slug]`)
- Sitemap source: `app/sitemap.ts` (emits `/term/[slug]` URLs)

This keeps a single source of truth for rendering MDX term content and related-term navigation.

## Overlapping Entry Points Inventory

The repository had multiple overlapping paths for term-like content:

- `index.html` + `script.js` (legacy static browser runtime)
- `app/term/[slug]/...`
- `app/(site)/term/[slug]/...`
- `app/terms/[slug]/...`
- `app/word/[slug]/...`
- `word/[slug]/...` (legacy non-App-Router tree)

## Deprecations and Redirects

The following routes now redirect to canonical URLs:

- `/terms/[slug]` → `/term/[slug]`
- `/word/[slug]` → `/term/[slug]`

## Migration Steps

1. Update any internal links that still point to `/terms/*` or `/word/*` so they point to `/term/*`.
2. Update automated backlink generation to emit `/term/[slug]` only.
3. Regenerate and verify sitemap entries use `/term/[slug]` only.
4. Remove remaining legacy renderers after downstream consumers are migrated.

## Follow-up Cleanup (Recommended)

- Consolidate the duplicate `/term/[slug]` renderers (`app/term/[slug]` vs `app/(site)/term/[slug]`) so only one implementation remains in the tree.
- Remove or archive the legacy static runtime (`index.html` / `script.js`) once Next.js routes are the only supported entry point.
