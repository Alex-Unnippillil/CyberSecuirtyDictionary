# Import-to-dependency audit

Scope: `app`, `components`, `lib`, `hooks`.

| Import specifier | Package mapping | Status | Example file |
|---|---|---|---|
| `@/components/term/TermPage` | `-` | built-in / internal | `app/term/[slug]/page.tsx` |
| `@ai-sdk/openai` | `@ai-sdk/openai` | dependency | `app/api/chat/route.ts` |
| `ai` | `ai` | dependency | `app/api/chat/route.ts` |
| `contentlayer/generated` | `-` | built-in / internal | `app/(site)/a-z/page.tsx` |
| `framer-motion` | `framer-motion` | dependency | `app/layout.tsx` |
| `fs` | `-` | built-in / internal | `app/[category]/page.tsx` |
| `gray-matter` | `gray-matter` | dependency | `app/term/[slug]/page.tsx` |
| `idb` | `idb` | dependency | `lib/personalTerms.ts` |
| `js-yaml` | `js-yaml` | devDependency | `app/[category]/page.tsx` |
| `next` | `next` | dependency | `app/(site)/term/[slug]/page.tsx` |
| `next-contentlayer/hooks` | `next-contentlayer` | dependency | `app/(site)/term/[slug]/page.tsx` |
| `next-mdx-remote/rsc` | `next-mdx-remote` | dependency | `components/term/TermPage.tsx` |
| `next/font/google` | `next` | dependency | `app/layout.tsx` |
| `next/head` | `next` | dependency | `app/page.tsx` |
| `next/headers` | `next` | dependency | `app/admin/page.tsx` |
| `next/image` | `next` | dependency | `components/content/MdxImage.tsx` |
| `next/link` | `next` | dependency | `app/(site)/a-z/page.tsx` |
| `next/navigation` | `next` | dependency | `app/(site)/term/[slug]/page.tsx` |
| `next/server` | `next` | dependency | `app/api/feedback/route.ts` |
| `node:fs/promises` | `-` | built-in / internal | `app/api/feedback/route.ts` |
| `node:path` | `-` | built-in / internal | `app/api/feedback/route.ts` |
| `path` | `-` | built-in / internal | `app/[category]/page.tsx` |
| `react` | `react` | dependency | `app/(site)/a-z/page.tsx` |
| `recharts` | `recharts` | dependency | `components/FrequencyMeter.tsx` |
| `socket.io` | `socket.io` | dependency | `app/api/socket/route.ts` |
| `socket.io-client` | `socket.io-client` | dependency | `hooks/useSocket.ts` |
| `swr` | `swr` | dependency | `components/PosTabs.tsx` |

## Missing package mappings

None.
