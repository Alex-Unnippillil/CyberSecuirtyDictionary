# Security Policy

We take the security of this project seriously.

## Reporting a Vulnerability

If you believe you've found a security vulnerability in this project, please email us at [security@example.com](mailto:security@example.com) with details.

We will acknowledge your report within 48 hours, investigate, and take appropriate action. Please avoid public disclosure until we've addressed the issue.


## Secret and API Key Rotation

- Generate new API keys through your provider's dashboard.
- Update the local `.env` file or secret manager with the new keys.
- Redeploy the application so it uses the rotated keys.
- Revoke old keys to prevent unauthorized use.
- Run `pre-commit run --all-files` to verify no secrets are committed.

Thanks for helping keep our project secure.
