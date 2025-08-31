# Threat Model

This document provides a STRIDE-style analysis for the static Cyber Security Dictionary website and its supply chain.

## STRIDE Analysis

### Spoofing

- **Static site:** An attacker hosts a lookalike domain to impersonate the site.
- **Supply chain:** Typosquatting on package names in dependencies.

### Tampering

- **Static site:** Unauthorized modification of HTML, CSS, or JavaScript files.
- **Supply chain:** Malicious changes introduced through compromised dependencies or build scripts.

### Repudiation

- **Static site:** Lack of audit trails makes it hard to trace changes to deployed files.
- **Supply chain:** Insufficient logging around package updates and build steps.

### Information Disclosure

- **Static site:** Exposing sensitive information or configuration in the published content.
- **Supply chain:** Leakage of secrets or tokens during the build process.

### Denial of Service

- **Static site:** Excessive requests could exhaust CDN or hosting resources.
- **Supply chain:** Dependency outages can halt builds or deployments.

### Elevation of Privilege

- **Static site:** Scripts could be manipulated to run with more privileges in the browser.
- **Supply chain:** Compromised packages may gain elevated permissions within the build environment.

## Mitigation Summary

| Category               | Example Mitigations                                                 |
| ---------------------- | ------------------------------------------------------------------- |
| Spoofing               | Use HTTPS with HSTS and enable MFA for repository access.           |
| Tampering              | Employ code reviews, signed commits, and Subresource Integrity.     |
| Repudiation            | Preserve build logs and sign commits to maintain accountability.    |
| Information Disclosure | Scan for secrets and limit sensitive data in the repository.        |
| Denial of Service      | Leverage CDN caching and monitor build pipeline availability.       |
| Elevation of Privilege | Apply least-privilege permissions and audit dependencies regularly. |
