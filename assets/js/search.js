(function(){
  const resultsContainer = document.getElementById('results');
  const searchInput = document.getElementById('search-box');
  let index = null;

  document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = window.__BASE_URL__ || '';
    fetch(`${baseUrl}/terms.json`)
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(data => {
        const terms = Array.isArray(data) ? data : (data.terms || []);
        index = searchCore.buildIndex(terms);
      })
      .catch(err => {
        console.error('Failed to load terms.json', err);
      });

    searchInput.addEventListener('input', handleSearch);
  });

  function handleSearch(){
    const query = searchInput.value.trim();
    resultsContainer.innerHTML = '';
    if(!query || !index){
      return;
    }
    const matches = searchCore.search(query, index.text, index.phonetic);
    matches.forEach(term => {
      resultsContainer.appendChild(renderCard(term));
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

    const syns = term.synonyms || [];
    if(syns.length){
      const syn = document.createElement('p');
      syn.className = 'synonyms';
      syn.textContent = `Synonyms: ${syns.join(', ')}`;
      card.appendChild(syn);
    }

    const acr = term.acronyms || [];
    if(acr.length){
      const ac = document.createElement('p');
      ac.className = 'acronyms';
      ac.textContent = `Acronyms: ${acr.join(', ')}`;
      card.appendChild(ac);
    }
    return card;
  }
})();
