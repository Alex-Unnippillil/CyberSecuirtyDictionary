## Runtime Decision

This project is **Next.js-first**. The production runtime is the Next.js `app/` router.

## Quick Start

1. Install dependencies:
   ```sh
   npm install
   ```
2. Run static checks and tests:
   ```sh
   npm test
   ```
3. Run the Next.js development server:
   ```sh
   npm run dev
   ```
4. Build for production:
   ```sh
   npm run build
   ```
5. Start the production server locally:
   ```sh
   npm run start
   ```

## Deployment

Deploy only the Next.js production runtime:

1. Install dependencies with lockfile:
   ```sh
   npm ci
   ```
2. Build the app:
   ```sh
   npm run build
   ```
3. Run the production server:
   ```sh
   npm run start
   ```

Direct static entrypoints such as `index.html`, `search.html`, and other root-level HTML files are no longer deployment entrypoints. They are not used in the production runtime.

For architecture details, see [docs/architecture.md](docs/architecture.md).

## Content Style Rules

- Add terms in `data/terms.yaml` using the existing fields: `name`, `slug`, `definition`, `category`, `synonyms`, `see_also`, and `sources`.
- Write definitions in clear, plain language and in one or two sentences.
- Use American English and title case for term names.
- Reference reputable sources and include URLs in the `sources` list.
- Maintain alphabetical order by `slug` to ease lookup.

## Security

For information on reporting vulnerabilities, please see our [Security Policy](SECURITY.md).
