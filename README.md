# CyberSecuirtyDictionary
https://alex-unnippillil.github.io/CyberSecuirtyDictionary/
![image](https://github.com/Alex-Unnippillil/CyberSecuirtyDictionary/assets/24538548/c5a54c56-babb-485d-b01c-4fdfb186325b)

## Security
For information on reporting vulnerabilities, please see our [Security Policy](SECURITY.md).

## Web Component

Embed individual terms on any HTML page with the `<cyber-term>` web component. Include the script and add the element with the desired `slug`:

```html
<script src="https://alex-unnippillil.github.io/CyberSecuirtyDictionary/cyber-term.js"></script>
<cyber-term slug="cve"></cyber-term>
```

The component fetches `terms.json` by default. You can point to a custom source with the `src` attribute:

```html
<cyber-term slug="cve" src="/path/to/terms.json"></cyber-term>
```
