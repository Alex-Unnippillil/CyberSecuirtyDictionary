(function(){
  const resultsContainer = document.getElementById('results');
  const searchInput = document.getElementById('search-box');
  const fuzzyToggle = document.getElementById('fuzzy-toggle');
  let terms = [];
  let isFuzzy = false;

  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const stored = localStorage.getItem('fuzzySearch');
    if (params.has('fuzzy')) {
      isFuzzy = params.get('fuzzy') === 'true';
    } else if (stored) {
      isFuzzy = stored === 'true';
    }
    fuzzyToggle.checked = isFuzzy;
    updateFuzzyParam(params);

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
    fuzzyToggle.addEventListener('change', () => {
      isFuzzy = fuzzyToggle.checked;
      try {
        localStorage.setItem('fuzzySearch', String(isFuzzy));
      } catch (e) {
        // Ignore storage errors
      }
      updateFuzzyParam(params);
      handleSearch();
    });
  });

  function updateFuzzyParam(params){
    if(isFuzzy){
      params.set('fuzzy','true');
    } else {
      params.delete('fuzzy');
    }
    const query = params.toString();
    const newUrl = `${window.location.pathname}${query ? '?' + query : ''}`;
    history.replaceState(null, '', newUrl);
  }

  function handleSearch(){
    const query = searchInput.value.trim().toLowerCase();
    resultsContainer.innerHTML = '';
    if(!query){
      return;
    }
    let matches;
    if(isFuzzy){
      matches = terms
        .map(term => ({ term, score: score(term, query) }))
        .filter(item => item.score > 0)
        .sort((a,b) => b.score - a.score)
        .map(item => item.term);
    } else {
      matches = terms.filter(term => exactMatch(term, query));
    }

    matches.forEach(term => {
      resultsContainer.appendChild(renderCard(term));
    });
  }

  function exactMatch(term, query){
    const name = (term.name || term.term || '').toLowerCase();
    const def = (term.definition || '').toLowerCase();
    const category = (term.category || '').toLowerCase();
    const syns = (term.synonyms || []).map(s=>s.toLowerCase());
    if(name.includes(query)) return true;
    if(def.includes(query)) return true;
    if(category.includes(query)) return true;
    if(syns.some(syn => syn.includes(query))) return true;
    return false;
  }

  function score(term, query){
    let s = 0;
    const name = (term.name || term.term || '').toLowerCase();
    const def = (term.definition || '').toLowerCase();
    const category = (term.category || '').toLowerCase();
    const syns = (term.synonyms || []).map(s=>s.toLowerCase());
    if(name.includes(query)) s += 3;
    if(def.includes(query)) s += 1;
    if(category.includes(query)) s += 1;
    if(syns.some(syn => syn.includes(query))) s += 2;
    return s;
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
