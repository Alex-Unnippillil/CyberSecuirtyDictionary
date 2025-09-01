# AGENTS Guide

This guide provides instructions and context for contributors and AI agents working in the `CyberSecuirtyDictionary` repository. It outlines guardrails, repository structure, common tasks, quality checks, release steps, coding conventions, and useful prompts.

## Guardrails

- **No secrets or credentials** should be committed to the repository.
- Keep the commit history linear; avoid force pushes and history rewrites.
- Respect existing licenses and attribution.
- Run all automated checks and ensure they pass before pushing changes.
- When in doubt, ask maintainers before introducing large dependencies or architectural changes.

## Repo Map

- `assets/` – Static resources such as compiled CSS and JavaScript used by the site.
- `data/terms.yaml` – Source of dictionary terms that build the `terms.json` file.
- `templates/` – HTML templates for various pages (e.g., `about.html`, `contribute.html`).
- `index.html`, `search.html`, `diagnostics.html` – Primary entry points for the static site.
- `script.js` and `assets/js/` – Client-side JavaScript for search, diagnostics, and metrics.
- `styles.css` and `assets/css/style.css` – Stylesheets for the site.
- `.github/` – Issue templates, pull request template, and workflow configuration.

## Common Tasks

- **Add a new term**: Update `data/terms.yaml`, run `npm run build` to regenerate `terms.json` and relevant pages, then commit both the source and generated files.
- **Edit site templates**: Modify the appropriate HTML file in `templates/` and run `npm run build` if the change affects generated pages.
- **Improve scripts or styles**: Update files under `assets/js/` or `assets/css/` and verify the site behaves as expected.

## Quality Checks

- `npm test` – Runs HTML validation on key pages and executes `diagnostics.test.js`.
- `npm run build` – Rebuilds generated assets; ensure this succeeds when relevant files change.
- Use `npx prettier --write <files>` to format JavaScript, JSON, YAML, and HTML files.

## Release Checklist

1. Ensure all terms and pages are up to date and tests pass.
2. Run `npm run build` and commit the generated artifacts.
3. Update version and changelog if necessary.
4. Tag the release and push tags to GitHub.

## Coding Conventions

- Use Prettier formatting with the repository's configuration.
- Prefer plain JavaScript and avoid introducing new frameworks without discussion.
- Maintain semantic HTML and accessible markup.
- Keep commit messages concise and in present tense (e.g., `add term for X`).

## AI Prompts

- "Add a new cybersecurity term to the dictionary."
- "Run tests and report any validation errors."
- "Generate the site and verify that HTML pages are valid."
- "Update documentation in templates/about.html and rebuild the site."
