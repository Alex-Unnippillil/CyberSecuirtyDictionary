# CyberSecuirtyDictionary
https://alex-unnippillil.github.io/CyberSecuirtyDictionary/
![image](https://github.com/Alex-Unnippillil/CyberSecuirtyDictionary/assets/24538548/c5a54c56-babb-485d-b01c-4fdfb186325b)

## Security
For information on reporting vulnerabilities, please see our [Security Policy](SECURITY.md).

## Localization

UI text is stored in JSON files under `locales/` and accessed through type-safe helpers.

### Adding a new language

1. Copy `locales/en.json` to `locales/<language>.json` and translate the values.
2. Ensure all keys are present; missing keys will fail CI.
3. Run `npm test` to validate locale files and HTML.
