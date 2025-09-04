# @yourscope/cyber-dictionary-data

Structured cybersecurity dictionary terms as versioned JSON for consumption in applications and tooling.

## Usage

```bash
npm install @yourscope/cyber-dictionary-data
```

```js
import terms from '@yourscope/cyber-dictionary-data/terms.json' assert { type: 'json' };
console.log(terms.version); // "0.0.1"
```

The package exports a single `terms.json` file containing a `version` property and a list of `terms`.
