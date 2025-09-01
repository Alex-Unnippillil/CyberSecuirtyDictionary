(function () {
  const resultsContainer = document.getElementById('results');
  const searchInput = document.getElementById('search-box');
  const chipContainer = document.getElementById('chip-container');
  const selectedChips = new Set();
  let miniSearch;
  let documents = [];

  document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = window.__BASE_URL__ || '';
    fetch(`${baseUrl}/terms.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((data) => {
        const terms = Array.isArray(data) ? data : data.terms || [];
        documents = terms.map((t, idx) => ({
          id: idx,
          name: t.name || t.term || '',
          definition: t.definition || '',
          category: t.category || '',
          tags: t.tags || [],
          synonyms: t.synonyms || []
        }));

        miniSearch = new MiniSearch({
          idField: 'id',
          fields: ['name', 'definition', 'category', 'tags', 'synonyms'],
          storeFields: ['name', 'definition', 'category', 'tags', 'synonyms']
        });
        miniSearch.addAll(documents);
        renderChips();
      })
      .catch((err) => {
        console.error('Failed to load terms.json', err);
      });

    searchInput.addEventListener('input', handleSearch);
  });

  function renderChips() {
    if (!chipContainer) return;
    const categories = new Set();
    documents.forEach((doc) => {
      if (Array.isArray(doc.tags)) {
        doc.tags.forEach((t) => categories.add(t));
      }
      if (doc.category) {
        categories.add(doc.category);
      }
    });

    Array.from(categories)
      .sort()
      .forEach((cat) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chip';
        btn.textContent = cat;
        btn.addEventListener('click', () => {
          if (selectedChips.has(cat)) {
            selectedChips.delete(cat);
            btn.classList.remove('selected');
          } else {
            selectedChips.add(cat);
            btn.classList.add('selected');
          }
          handleSearch();
        });
        chipContainer.appendChild(btn);
      });
  }

  function handleSearch() {
    const query = searchInput.value.trim();
    resultsContainer.innerHTML = '';
    if (!query) {
      return;
    }
    const filters = Array.from(selectedChips);
    const results = miniSearch.search(query, {
      prefix: true,
      filter: (result) => {
        if (filters.length === 0) return true;
        const tags = result.tags || [];
        const cat = result.category ? [result.category] : [];
        return tags.concat(cat).some((t) => filters.includes(t));
      }
    });
    results.forEach((res) => {
      resultsContainer.appendChild(renderCard(res));
    });
  }

  function renderCard(term) {
    const card = document.createElement('div');
    card.className = 'result-card';

    const title = document.createElement('h3');
    title.textContent = term.name || term.term || '';
    card.appendChild(title);

    if (term.category) {
      const cat = document.createElement('p');
      cat.className = 'category';
      cat.textContent = term.category;
      card.appendChild(cat);
    }

    const def = document.createElement('p');
    def.textContent = term.definition || '';
    card.appendChild(def);

    if (term.synonyms && term.synonyms.length) {
      const syn = document.createElement('p');
      syn.className = 'synonyms';
      syn.textContent = `Synonyms: ${term.synonyms.join(', ')}`;
      card.appendChild(syn);
    }
    return card;
  }
})();

