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

## Issue labels

The project uses labels to organize work:

- `content` – dictionary entries and definitions. Issues created via the "New term" template are labeled automatically.
- `site` – website or build tooling tasks.
- `i18n` – internationalization and localization.
- `a11y` – accessibility improvements.
- `good first issue` – small tasks that are great for newcomers.

Pull requests are labeled automatically based on changed files using the [Labeler workflow](.github/workflows/labeler.yml).

## Pull request checklist

- Make sure your changes pass tests (`npm test` if available).
- Follow the [pull request template](.github/PULL_REQUEST_TEMPLATE.md).
- Keep descriptions concise and clear.

If you have questions, feel free to open an issue.
