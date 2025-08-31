# Contributing

Thank you for taking the time to contribute to the Cyber Security Dictionary!

## Adding a new term

1. **Open an issue**
   - Use the ["New term" issue template](.github/ISSUE_TEMPLATE/new-term.yml).
   - Include the term, a clear definition, and optional sources.
2. **Submit a pull request**
   - Fork the repository and update `data.json` with your term.
   - Reference the issue in your pull request.
   - Ensure any related documentation is updated.

## Pull request checklist

- Make sure your changes pass tests (`npm test` if available).
- Pre-commit hooks run type checking, linting, and content linting.
- Follow the [pull request template](.github/PULL_REQUEST_TEMPLATE.md).
- Keep descriptions concise and clear.

## Development setup

Install dependencies to enable the Git hooks:

```bash
npm install
```

The `pre-commit` hook runs `npm run typecheck` and then `lint-staged` to
format code and spell-check markdown. Commits are rejected when these checks
fail. You can run the checks manually with:

```bash
npm run typecheck
npx lint-staged --no-stash
```

If you have questions, feel free to open an issue.
