# CyberSecuirtyDictionary
https://alex-unnippillil.github.io/CyberSecuirtyDictionary/
![image](https://github.com/Alex-Unnippillil/CyberSecuirtyDictionary/assets/24538548/c5a54c56-babb-485d-b01c-4fdfb186325b)

## Security
For information on reporting vulnerabilities, please see our [Security Policy](SECURITY.md).

## Environment Variables

The site can be customized through environment variables. Configure these in your Vercel project settings:

- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_AI_MODELS`
- `AI_PROVIDER`
- `AI_API_KEY`

For local development, copy `.env.example` to `.env` and update the values. Variables prefixed with `NEXT_PUBLIC_` are exposed to client-side code via `assets/js/env-config.js`.
