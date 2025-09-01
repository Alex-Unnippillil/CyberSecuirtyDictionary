# Hydration Profile

Measurements taken with Node.js and JSDOM.

- Baseline immediate hydration (dictionary logic executed on load): ~8.1ms
- Island entry without widgets hydrated: ~0.7ms

Deferred hydration cuts initial script execution time by roughly 90%.
