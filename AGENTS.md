# Repository Agent Instructions

These instructions apply to the root of the repository and **all subdirectories** including `.github/`, `assets/`, `data/`, `templates/`, `.well-known/`, and any others unless a nested `AGENTS.md` overrides them.

## Guardrails
- Avoid `ls -R` and `grep -R`; use `rg` for searching.
- Keep commit history linear; do not amend or rebase existing commits.
- Limit external network access to installing dependencies or running checks.
- Do not add large or unnecessary dependencies.

## Task Workflow
1. Identify relevant `AGENTS.md` files for the files you modify.
2. Follow the coding conventions below.
3. Run the required quality checks and record their results:
   - `npm run typecheck`
   - `npm run prebuild`
4. Commit changes with a descriptive message once checks pass or errors are documented.

## Coding Conventions
- Use Prettier for formatting with the existing project configuration.
- Indent with two spaces and end files with a newline.
- Use double quotes for JavaScript strings and include semicolons.
- Avoid trailing whitespace and keep commits focused.

