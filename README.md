
## Quick Start

1. Install dependencies:
   ```sh
   npm install
   ```
2. Run static checks and tests:
   ```sh
   npm test
   ```
3. Preview the site locally by serving the repository root. Any static server works; for example, using [`http-server`](https://www.npmjs.com/package/http-server):
   ```sh
   npx http-server
   ```

## Deployment

The project is a static site published with GitHub Pages. After updating content, ensure tests pass and push changes to the default branch. GitHub Pages will rebuild and deploy the site automatically. When changing security contact details, regenerate `.well-known/security.txt` by running:

```sh
./build.sh
```

## Content Style Rules

- Add terms in `data/terms.yaml` using the existing fields: `name`, `slug`, `definition`, `category`, `synonyms`, `see_also`, and `sources`.
- Write definitions in clear, plain language and in one or two sentences.
- Use American English and title case for term names.
- Reference reputable sources and include URLs in the `sources` list.
- Maintain alphabetical order by `slug` to ease lookup.

## Security

For information on reporting vulnerabilities, please see our [Security Policy](SECURITY.md).


## Security headers / CSP

Security policy headers for the Next.js runtime are defined in `next.config.mjs`.

- `Strict-Transport-Security` is set to `max-age=63072000; includeSubDomains; preload`.
- `Referrer-Policy` is set to `no-referrer`.
- `X-Content-Type-Options` is set to `nosniff`.
- `Permissions-Policy` disables `geolocation`, `microphone`, and `camera`.
- The Content Security Policy (CSP) uses:
  - `default-src 'self'`
  - `script-src 'self'`
  - `style-src 'self' 'unsafe-inline'`
  - `object-src 'none'`
  - `base-uri 'none'`

Set `CSP_ENFORCE=true` to send CSP as the enforced `Content-Security-Policy` header. If `CSP_ENFORCE` is unset or not `true`, the same policy is sent as `Content-Security-Policy-Report-Only` so contributors can validate policy impact before enforcing it.
