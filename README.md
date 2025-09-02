# CyberSecuirtyDictionary

https://alex-unnippillil.github.io/CyberSecuirtyDictionary/
![image](https://github.com/Alex-Unnippillil/CyberSecuirtyDictionary/assets/24538548/c5a54c56-babb-485d-b01c-4fdfb186325b)

## Quick Start

1. Install dependencies:
   ```sh
   npm install
   ```
2. Run static checks and tests:
   ```sh
   npm test
   ```
3. Preview the site locally by serving the repository root. Any static server works; for example, using [`http-server`](https://www.npmjs.com/package/http-server):
   ```sh
   npx http-server
   ```

## Environment Variables

Runtime configuration is provided through a local `.env.local` file. Create this file in the project root and add any needed keys:

```env
NEXT_PUBLIC_DICTIONARY_API_BASE=https://api.dictionaryapi.dev/api/v2/entries/en
```

Variables prefixed with `NEXT_PUBLIC_` are exposed to the client and can be accessed in code via `process.env.NEXT_PUBLIC_*`.

## Deployment

The project is a static site published with GitHub Pages. After updating content, ensure tests pass and push changes to the default branch. GitHub Pages will rebuild and deploy the site automatically. When changing security contact details, regenerate `.well-known/security.txt` by running:

```sh
./build.sh
```

## Content Style Rules

- Add terms in `data/terms.yaml` using the existing fields: `name`, `slug`, `definition`, `category`, `synonyms`, `see_also`, and `sources`.
- Write definitions in clear, plain language and in one or two sentences.
- Use American English and title case for term names.
- Reference reputable sources and include URLs in the `sources` list.
- Maintain alphabetical order by `slug` to ease lookup.

## Security

For information on reporting vulnerabilities, please see our [Security Policy](SECURITY.md).

