# Importers

Adapters convert CSV, YAML, or JSON content into the internal term format used
by the project.

## Internal term format

Each term is represented as an object:

```
{ term: string, definition: string, tags: string[] }
```

## Usage

```javascript
const fs = require('fs');
const { CSVAdapter } = require('./csv');

const content = fs.readFileSync('samples/sample.csv', 'utf8');
const adapter = new CSVAdapter();
const terms = adapter.parse(content);
console.log(terms);
```

The example above reads `samples/sample.csv` and produces:

```json
[
  {
    "term": "Phishing",
    "definition": "An attempt to trick users into revealing information",
    "tags": ["attack", "social"]
  },
  {
    "term": "Firewall",
    "definition": "A device that monitors and filters network traffic",
    "tags": ["defense", "network"]
  }
]
```

Additional adapters for YAML (`YAMLAdapter`) and JSON (`JSONAdapter`) are also
available. Sample source files for each format are located in `samples/`.
