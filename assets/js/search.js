(function(){
  const resultsContainer = document.getElementById('results');
  const searchInput = document.getElementById('search-box');
  const suggestionsContainer = document.getElementById('suggestions');
  let terms = [];

  document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = window.__BASE_URL__ || '';
    fetch(`${baseUrl}/terms.json`)
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(data => {
        // terms.json may either be an array or object with terms property
        terms = Array.isArray(data) ? data : (data.terms || []);
      })
      .catch(err => {
        console.error('Failed to load terms.json', err);
      });

    searchInput.addEventListener('input', handleSearch);
  });

  function handleSearch(){
    const query = searchInput.value.trim().toLowerCase();
    resultsContainer.innerHTML = '';
    if(suggestionsContainer) suggestionsContainer.innerHTML = '';
    if(!query){
      return;
    }
    const suggestions = [];
    terms.forEach(term => {
      const name = (term.name || term.term || '').toLowerCase();
      const def = (term.definition || '').toLowerCase();
      const category = (term.category || '').toLowerCase();
      const syns = (term.synonyms || []).map(s=>s.toLowerCase());
      const includes =
        name.includes(query) ||
        def.includes(query) ||
        category.includes(query) ||
        syns.some(syn => syn.includes(query));
      const dist = damerauLevenshtein(name, query);
      if(includes || dist <= 2){
        resultsContainer.appendChild(renderCard(term));
        if(!includes && dist <=2){
          suggestions.push({term: term.name || term.term, dist});
        }
      }
    });
    if(suggestionsContainer && suggestions.length){
      suggestions.sort((a,b)=>a.dist - b.dist);
      const text = suggestions.slice(0,3).map(s=>s.term).join(', ');
      suggestionsContainer.textContent = `Did you mean: ${text}?`;
    }
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
