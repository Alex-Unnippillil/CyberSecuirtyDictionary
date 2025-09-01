(function(){
  const resultsContainer = document.getElementById('results');
  const searchInput = document.getElementById('search-box');
  const suggestionsContainer = document.getElementById('suggestions');
  let miniSearch;
  let suggestions = [];
  let selectedIndex = -1;

  document.addEventListener('DOMContentLoaded', async () => {
    const baseUrl = window.__BASE_URL__ || '';
    try {
      const indexData = await fetch(`${baseUrl}/minisearch-index.json`).then(r => r.json());
      miniSearch = MiniSearch.loadJSON(indexData, {
        fields: ['term', 'definition'],
        storeFields: ['term', 'definition']
      });
    } catch (err) {
      console.error('Failed to load MiniSearch index', err);
      return;
    }
    searchInput.addEventListener('input', onInput);
    searchInput.addEventListener('keydown', onKeyDown);
  });

  function onInput(){
    const query = searchInput.value.trim();
    resultsContainer.innerHTML = '';
    suggestionsContainer.innerHTML = '';
    selectedIndex = -1;
    if(!query || !miniSearch){
      return;
    }
    suggestions = miniSearch.autoSuggest(query).slice(0,5);
    suggestions.forEach((s, i) => {
      const li = document.createElement('li');
      li.textContent = s.suggestion;
      li.addEventListener('mousedown', () => {
        searchInput.value = s.suggestion;
        suggestionsContainer.innerHTML = '';
        displayResults(s.suggestion);
      });
      suggestionsContainer.appendChild(li);
    });
    displayResults(query);
  }

  function onKeyDown(e){
    const items = suggestionsContainer.querySelectorAll('li');
    if(e.key === 'ArrowDown' && items.length){
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % items.length;
      updateSelection(items);
    } else if(e.key === 'ArrowUp' && items.length){
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      updateSelection(items);
    } else if(e.key === 'Enter' && selectedIndex >= 0){
      e.preventDefault();
      const text = items[selectedIndex].textContent;
      searchInput.value = text;
      suggestionsContainer.innerHTML = '';
      displayResults(text);
    }
  }

  function updateSelection(items){
    items.forEach((item, i) => {
      item.classList.toggle('selected', i === selectedIndex);
    });
  }

  function displayResults(query){
    resultsContainer.innerHTML = '';
    miniSearch.search(query).forEach(result => {
      resultsContainer.appendChild(renderCard(result));
    });
  }

  function renderCard(term){
    const card = document.createElement('div');
    card.className = 'result-card';

    const title = document.createElement('h3');
    title.textContent = term.name || term.term || '';
    card.appendChild(title);

    if(term.category){
      const cat = document.createElement('p');
      cat.className = 'category';
      cat.textContent = term.category;
      card.appendChild(cat);
    }

    const def = document.createElement('p');
    def.textContent = term.definition || '';
    card.appendChild(def);

    if(term.synonyms && term.synonyms.length){
      const syn = document.createElement('p');
      syn.className = 'synonyms';
      syn.textContent = `Synonyms: ${term.synonyms.join(', ')}`;
      card.appendChild(syn);
    }
    return card;
  }
})();
