# CyberSecuirtyDictionary
https://alex-unnippillil.github.io/CyberSecuirtyDictionary/
![image](https://github.com/Alex-Unnippillil/CyberSecuirtyDictionary/assets/24538548/c5a54c56-babb-485d-b01c-4fdfb186325b)

## Security
For information on reporting vulnerabilities, please see our [Security Policy](SECURITY.md).

## API

Public clients can fetch individual term definitions via a simple HTTP API.

### `GET /api/definitions/{slug}`

Returns JSON containing the term, its definition, and the source URLs used to
compile the entry. Example response:

```json
{
  "term": "cve",
  "definition": "A public catalog of cybersecurity vulnerabilities providing unique identifiers for known software flaws.",
  "sources": ["https://cve.mitre.org"]
}
```

The endpoint sets permissive CORS headers and enforces a rate limit of 60
requests per minute per IP address. Exceeding the limit results in a `429 Too
Many Requests` response.
