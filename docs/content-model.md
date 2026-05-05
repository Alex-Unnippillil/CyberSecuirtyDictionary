# Content Model

This project uses **`content/terms/*.mdx`** as the canonical source of truth for term content.

## Canonical folder layout

```text
content/
  terms/
    <slug>.mdx
    sql-injection.mdx
    zero-trust.mdx
    ...
```

- Each file name should be the canonical slug (kebab-case).
- Each term should live in exactly one MDX file under `content/terms`.
- Runtime loaders and search indexing read from this directory via `lib/content/api.ts`.

## Expected frontmatter schema

Recommended frontmatter:

```yaml
---
title: "SQL Injection"          # string, recommended
slug: sql-injection              # string, optional if filename matches
shortDefinition: "..."          # string, optional summary used in some views
category: "Application Security"# string, optional
tags:                            # string[], optional
  - owasp
  - injection
synonyms:                        # string[], optional
  - SQLi
see_also:                        # string[], optional slugs
  - injection
sources:                         # string[], optional canonical source URLs
  - https://owasp.org/Top10/A03_2021-Injection/
---
```

Notes:
- `title` is strongly recommended. If omitted, loaders may fall back to first markdown heading (`# Heading`) or a titleized slug.
- `slug` should match the filename when provided.
- Prefer stable, canonical URLs in `sources`.

## Validation behavior

At startup/build time, the content loader validates that `content/terms` exists and is a directory.
If it is missing, the app throws an error and fails fast.

## YAML loader status

Legacy YAML-based loading (`data/terms.yaml`) has been removed from runtime loaders.
All term reads should go through the canonical MDX loader in `lib/content/api.ts`.
