# Contributing

Thank you for taking the time to contribute to the Cyber Security Dictionary!

## Adding a new term

1. **Open an issue**
   - Use the ["New term" issue template](.github/ISSUE_TEMPLATE/new-term.yml).
   - Include the term, a clear definition, and at least one reputable source.
2. **Submit a pull request**
   - Fork the repository and update `data/terms.yaml` with your term.
   - Reference the issue in your pull request.
   - Ensure any related documentation is updated.

### Term template

Add your entry to `data/terms.yaml` using the following structure:

```yaml
- name: Example Term
  slug: example-term
  definition: >-
    Concise, original explanation of the concept.
  category: Category Name
  synonyms:
    - Optional synonym
  see_also:
    - RelatedTerm
  sources:
    - https://example.org/reference
```

- `name`: term as it should appear.
- `slug`: URL-friendly version of the name.
- `definition`: one- to two-sentence description written in your own words.
- `category`: grouping to help with browsing.
- `synonyms`: optional list of alternative names.
- `see_also`: optional list of related terms.
- `sources`: list of references that informed the definition.

### Citation policy

Definitions must be original and supported by credible references.
List every source in the `sources` array as a full URL or citation.
Avoid copying text directly; if you quote, use quotation marks and attribute the source.

## Pull request checklist

- Make sure your changes pass tests (`npm test` if available).
- Follow the [pull request template](.github/PULL_REQUEST_TEMPLATE.md).
- Keep descriptions concise and clear.

## Branch policies

- **Signed commits** are required. Configure your Git client to sign commits with GPG.
- **Linear history** is enforced. Rebase or squash before merging; merge commits are not allowed.
- **Status checks** must pass before merging. The `CI / lint` workflow is required, and merges are blocked until it succeeds.

If you have questions, feel free to open an issue.
