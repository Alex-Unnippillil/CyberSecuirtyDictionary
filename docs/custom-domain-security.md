# Custom Domain Security

When hosting this project on a custom domain you should serve appropriate security headers and integrity metadata to protect visitors.

## Content Security Policy (CSP)
Define a strict [Content Security Policy](https://developer.mozilla.org/docs/Web/HTTP/CSP) header to limit where scripts, styles, images and other resources can be loaded from.  A simple example for a site that only loads local resources is:

```
Content-Security-Policy: default-src 'self'; base-uri 'self'; form-action 'self'
```

Adjust the policy if you load assets from additional origins.

## Subresource Integrity (SRI)
If you include third party scripts or styles, add [Subresource Integrity](https://developer.mozilla.org/docs/Web/Security/Subresource_Integrity) hashes to the `integrity` attribute so the browser can verify the resource has not been modified.

## Referrer Policy
Set a [Referrer-Policy](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy) header to control how much referrer information is shared with external sites.  A privacy‑respecting option is:

```
Referrer-Policy: no-referrer
```

## Security.txt
Publish contact details for security reports at [`/.well-known/security.txt`](../.well-known/security.txt).

