# External Vendor Policy

This project restricts references to external domains to a vetted allowlist. Any new external domain must be reviewed for security and privacy implications before inclusion. Contributors introducing a new domain must update this policy and the allowlist or request an override.

## Allowed Domains

| Domain | Rationale |
| --- | --- |
| alex-unnippillil.github.io | Host for the project's GitHub Pages site |
| fonts.googleapis.com | Loads typography via Google Fonts |
| github.com | Links to repository resources and assets |
| nvlpubs.nist.gov | References to NIST publications |
| nvd.nist.gov | Links to the National Vulnerability Database |
| cve.mitre.org | References to CVE entries |
| cwe.mitre.org | References to CWE definitions |
| www.first.org | Links to FIRST security resources |
| attack.mitre.org | References to the MITRE ATT&CK framework |
| owasp.org | Links to OWASP guidance |
| www.sitemaps.org | XML sitemap namespace |
| www.rfc-editor.org | Links to relevant RFC documents |

To override this policy for exceptional cases, set the environment variable `ALLOW_NEW_DOMAINS=1` in CI and include justification in the pull request.
