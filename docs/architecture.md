# Architecture (Single Source of Truth)

## Production Runtime

- **Runtime:** Next.js-first.
- **Entrypoint:** `app/layout.tsx` + route files under `app/**/page.tsx`.
- **Serving model:** `next build` output served by `next start`.

## Routing

All production routes are App Router routes defined in `app/`.

Primary route families:

- Home: `app/page.tsx`
- Search and discovery: `app/search/page.tsx`, `app/a-z/page.tsx`, `app/(site)/a-z/page.tsx`
- Term detail routes: `app/term/[slug]/page.tsx`, `app/terms/[slug]/page.tsx`, `app/word/[slug]/page.tsx`, `app/(site)/term/[slug]/page.tsx`
- Comparison routes: `app/compare/page.tsx`, `app/compare/[a]-vs-[b]/page.tsx`
- Settings/admin: `app/settings/page.tsx`, `app/(site)/settings/page.tsx`, `app/admin/page.tsx`
- API endpoints: `app/api/**/route.ts`

### Non-Entrypoint Static Files

Root-level static HTML files (for example `index.html`, `search.html`, `categories.html`, `diagnostics.html`, `import.html`) are legacy assets and are **not** production entrypoints.

## Data Sources

- Canonical term content: `content/terms/*.mdx`
- JSON-backed data and configuration used by tools/routes: `terms.json`, `frequency.json`, `site.config.json`, and supporting files in `public/`
- Runtime readers and adapters live in `lib/**` and are consumed by App Router pages and API routes.

## Deployment Flow

1. `npm ci`
2. `npm run build` (Next.js production build)
3. `npm run start` (serve Next.js runtime)

Containerized deployment mirrors the same flow and does not serve root-level static HTML entrypoints directly.
