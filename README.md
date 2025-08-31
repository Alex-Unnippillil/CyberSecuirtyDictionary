# Cyber Security Dictionary

An interactive glossary of cybersecurity terminology. Visit the live site at https://alex-unnippillil.github.io/CyberSecuirtyDictionary/

![Screenshot](https://github.com/Alex-Unnippillil/CyberSecuirtyDictionary/assets/24538548/c5a54c56-babb-485d-b01c-4fdfb186325b)

## Purpose
Provide concise definitions for common security concepts in an easy-to-navigate format.

## Features
- Search bar with live filtering and term highlighting
- Alphabet navigation for quick browsing
- Random term and daily term display
- Favorite terms stored in the browser with optional filter
- Dark mode toggle and scroll-to-top button

## Quick Start
```bash
git clone https://github.com/Alex-Unnippillil/CyberSecuirtyDictionary.git
cd CyberSecuirtyDictionary
python3 -m http.server
```
Open http://localhost:8000 in your browser.

## Deployment
Pushing to the `main` branch triggers GitHub Pages deployment via the workflows in `.github/workflows`.

## Data Model
Dictionary content resides in `data.json`:
```json
{
  "terms": [
    {
      "term": "Phishing",
      "definition": "An attempt to trick individuals into revealing sensitive information through fraudulent emails, websites, or messages."
    }
  ]
}
```

## Accessibility & SEO
- Meets [WCAG 2.1](https://www.w3.org/TR/WCAG21/) guidelines and uses ARIA labels for navigation and controls.
- Provides [schema.org](https://schema.org/WebSite) structured data and Open Graph/Twitter meta tags.
- Includes `sitemap.xml` and `robots.txt` for search engine indexing.

## Contributing
See [CONTRIBUTING](CONTRIBUTING.md) for guidelines.

## Code of Conduct
Please read [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md).

## Security
Security issues can be reported as described in [SECURITY](SECURITY.md).

## License
This project is licensed under the [MIT License](LICENSE).
