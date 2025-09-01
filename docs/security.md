# Security Headers

The API routes are protected by middleware that adds several security headers:

- **Strict-Transport-Security**: `max-age=63072000; includeSubDomains; preload` enforces HTTPS with HSTS.
- **X-DNS-Prefetch-Control**: `off` disables DNS prefetching to prevent information leakage.
- **CORS**: Only requests from `https://alex-unnippillil.github.io` are allowed.
  - `Access-Control-Allow-Methods`: `GET,POST,OPTIONS`
  - `Access-Control-Allow-Headers`: `Content-Type, Authorization`
  - Preflight requests receive a `204` response.

Run [securityheaders.com](https://securityheaders.com/) after deployment to confirm the site scores grade **A**.
