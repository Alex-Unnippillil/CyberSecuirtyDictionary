# Switching to Fuse.js Search

The default search implementation uses a simple scoring function. To enable fuzzy search with [Fuse.js](https://fusejs.io/), include the Fuse library and update `assets/js/search.js` to use it.

## 1. Include Fuse.js

Add a script tag to load Fuse before the site's search script:

```html
<script src="https://cdn.jsdelivr.net/npm/fuse.js@6.6.2"></script>
```

## 2. Create a Fuse instance

After `terms.json` loads, create a Fuse instance configured with the data fields to search:

```js
const fuse = new Fuse(terms, {
  keys: ['name', 'term', 'definition', 'category', 'synonyms'],
  includeScore: true,
  threshold: 0.3,
  distance: 100,
  minMatchCharLength: 2,
});
```

## 3. Perform searches

Replace the manual `handleSearch` logic with Fuse's `search` method:

```js
function handleSearch(){
  const query = searchInput.value.trim();
  resultsContainer.innerHTML = '';
  if(!query) return;

  const matches = fuse.search(query);
  matches.forEach(({ item }) => {
    resultsContainer.appendChild(renderCard(item));
  });
}
```

## Relevant options

* **keys** – Object keys in each term to index for searching.
* **threshold** – Controls fuzziness; lower values require closer matches.
* **distance** – How far in the text the match can be from the expected location.
* **includeScore** – Include match scores in results.
* **minMatchCharLength** – Minimum number of characters required to match.
* **ignoreLocation** – Set to `true` to ignore the location of the match within the string.
* **useExtendedSearch** – Enables advanced matching syntax.

Adjust these options to tune search behavior. See the [Fuse.js documentation](https://fusejs.io/api/options.html) for full details.
