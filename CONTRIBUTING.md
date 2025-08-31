# Contributing

Thank you for your interest in improving CyberSecuirtyDictionary. The project is a static site served by GitHub Pages that collects cybersecurity terms and definitions.

## Proposing new terms

1. Fork the repository and clone your fork.
2. Add a new entry to `data.json` in the `terms` array. Keep entries in alphabetical order where possible.
3. Each term should include the following fields:
   ```json
   {
     "term": "Example Term",
     "definition": "A clear and concise description of the term.",
     "source": "https://example.com/reference"
   }
   ```
4. Use credible references for definitions. When possible, prefer vendor‑neutral or standards‑based sources.

## Citing sources

- Include a `source` URL for each new term in `data.json`.
- Mention the reference again in your pull request description for easy verification.

## Building and previewing

The site is plain HTML/JS, so no compilation is required. To preview your changes locally:

1. Ensure Python 3 is installed.
2. From the repository root, run:
   ```bash
   python -m http.server
   ```
3. Open `http://localhost:8000` in your browser and verify your changes.

## Submitting pull requests

1. Commit your changes with clear, descriptive messages.
2. Push the commit(s) to your fork and open a pull request against the `main` branch.
3. In the PR, describe the term(s) added or updated and link to the source for each.
4. A project maintainer will review your contribution. Please be responsive to feedback until the PR is merged.

We appreciate your contributions to keeping the dictionary accurate and up to date!
