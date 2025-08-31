# CyberSecuirtyDictionary
https://alex-unnippillil.github.io/CyberSecuirtyDictionary/
![image](https://github.com/Alex-Unnippillil/CyberSecuirtyDictionary/assets/24538548/c5a54c56-babb-485d-b01c-4fdfb186325b)

## Security
For information on reporting vulnerabilities, please see our [Security Policy](SECURITY.md).

## API
Dictionary data is published as JSON so you can consume it without scraping the site.

Fetch all terms:

```javascript
fetch('https://alex-unnippillil.github.io/CyberSecuirtyDictionary/api/terms.json')
  .then(res => res.json())
  .then(data => console.log(data));
```

Fetch a single term by slug:

```javascript
fetch('https://alex-unnippillil.github.io/CyberSecuirtyDictionary/api/terms/cve.json')
  .then(res => res.json())
  .then(data => console.log(data));
```
