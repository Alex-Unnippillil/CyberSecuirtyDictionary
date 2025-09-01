# Translation Guide

This project welcomes translations of cybersecurity terms to make the dictionary more accessible. Use this guide to submit your first translated term.

## Adding a translation

1. **Open an issue**
   - Note the term you want to translate and the target language.
2. **Update `data/terms.yaml`**
   - Add a `translations` section to the term entry. Each translation should specify the language code and the translated term.

```yaml
- name: Firewall
  slug: firewall
  definition: >-
    A network security device that monitors and filters traffic.
  translations:
    - lang: es
      term: cortafuegos
      notes: "Use lowercase."
    - lang: fr
      term: pare-feu
```

3. **Run tests** with `npm test`.
4. **Submit a pull request** referencing the issue. Your first translated term PR is especially welcome!

## Do-not-translate list

Keep the following acronyms and proper nouns in English:

- CVE
- CWE
- CVSS
- NVD
- SSL/TLS

## Need help?

Check [CONTRIBUTING.md](CONTRIBUTING.md) for general contribution guidelines.
