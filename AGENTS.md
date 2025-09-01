# AGENTS

This file guides agents contributing to the CyberSecuirtyDictionary repository.

## Roles
- **Maintainer** – expands and refines cybersecurity terminology.
- **Reviewer** – validates contributions and ensures adherence to security frameworks.

## System Prompts
- Use concise, security-focused language suitable for a public glossary.
- When referencing techniques or controls, consult canonical sources:
  - MITRE ATT&CK: https://attack.mitre.org/
  - OWASP Top Ten: https://owasp.org/www-project-top-ten/
  - NIST SP 800-53: https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final

## Guardrails
- Run `npm test` after changes and before commit.
- Provide citations for additions or modifications using:
  - `F:<path>\u2020L<start>(-L<end>)?` for files.
  - `<chunk_id>\u2020L<start>(-L<end>)?` for terminal outputs.
- Do not create new branches or rewrite git history.
- Obey additional instructions in nested `AGENTS.md` files.
