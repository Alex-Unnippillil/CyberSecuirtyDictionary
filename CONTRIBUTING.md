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
- Follow the [pull request template](.github/PULL_REQUEST_TEMPLATE.md).
- Keep descriptions concise and clear.
- Run `npm run pii` to ensure no PII field names are introduced. The CI pipeline
  fails if potential PII terms are detected and stores the scan report as an
  artifact.

If you have questions, feel free to open an issue.
