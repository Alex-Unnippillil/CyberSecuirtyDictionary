(function(){
  const resultsContainer = document.getElementById('anagram-results');
  const input = document.getElementById('anagram-input');
  let terms = [];

  document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = window.__BASE_URL__ || '';
    fetch(`${baseUrl}/terms.json`)
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(data => {
        const rawTerms = Array.isArray(data) ? data : (data.terms || []);
        terms = rawTerms.map(t => ({ ...t, normalized: normalize(t.term || t.name || '') }));
      })
      .catch(err => {
        console.error('Failed to load terms.json', err);
      });

    input.addEventListener('input', handleInput);
  });

  function normalize(str){
    return (str || '')
      .toLowerCase()
      .replace(/[^a-z]/g, '')
      .split('')
      .sort()
      .join('');
  }

  function handleInput(){
    const query = input.value.trim();
    resultsContainer.innerHTML = '';
    if(!query){
      return;
    }
    const normalizedQuery = normalize(query);
    const matches = terms.filter(t => t.normalized === normalizedQuery);
    matches.forEach(match => {
      resultsContainer.appendChild(renderCard(match));
    });
  }

  function renderCard(term){
    const card = document.createElement('div');
    card.className = 'result-card';

    const title = document.createElement('h3');
    title.textContent = term.term || term.name || '';
    card.appendChild(title);

    if(term.definition){
      const def = document.createElement('p');
      def.textContent = term.definition;
      card.appendChild(def);
    }

    return card;
  }
})();
