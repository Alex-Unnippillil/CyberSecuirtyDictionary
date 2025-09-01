(function(){
  const resultsContainer = document.getElementById('results');
  const suggestionsContainer = document.getElementById('suggestions');
  const searchInput = document.getElementById('search-box');
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
    suggestionsContainer.innerHTML = '';
    if(!query){
      return;
    }

    const { matches, didYouMean } = searchTerms(query);

    if(didYouMean.length){
      renderSuggestions(didYouMean);
    }

    matches.forEach(({ term }) => {
      resultsContainer.appendChild(renderCard(term));
    });
  }

  function searchTerms(query){
    const matches = terms
      .map(term => ({ term, score: score(term, query) }))
      .filter(item => item.score > 0)
      .sort((a,b) => b.score - a.score);

    let suggestions = [];
    if (typeof fuzzysort !== 'undefined') {
      suggestions = fuzzysort.go(query, terms, {
        key: t => (t.name || t.term || ''),
        limit: 3
      }).map(r => r.obj.name || r.obj.term || '')
        .filter(s => s.toLowerCase() !== query);
    }

    return { matches, didYouMean: suggestions };
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

  function renderSuggestions(list){
    if(!list.length) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'did-you-mean';
    wrapper.appendChild(document.createTextNode('Did you mean '));

    list.forEach((s, idx) => {
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = s;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        searchInput.value = s;
        handleSearch();
      });
      wrapper.appendChild(link);

      if(idx < list.length - 1){
        wrapper.appendChild(document.createTextNode(idx === list.length - 2 ? ' or ' : ', '));
      } else {
        wrapper.appendChild(document.createTextNode('?'));
      }
    });

    suggestionsContainer.appendChild(wrapper);
  }
})();
