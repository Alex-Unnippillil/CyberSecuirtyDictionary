(function(){
  const resultsContainer = document.getElementById('results');
  const searchInput = document.getElementById('search-box');
  let terms = [];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    searchInput.addEventListener('focus', () => {
      if (!prefersReducedMotion && window.motion) {
        window.motion.animate(searchInput, { scale: 1.05 }, { duration: 0.2, easing: 'ease-in-out' });
      }
    });
    searchInput.addEventListener('blur', () => {
      if (!prefersReducedMotion && window.motion) {
        window.motion.animate(searchInput, { scale: 1 }, { duration: 0.2, easing: 'ease-in-out' });
      }
      hideResults();
    });
  });

  function handleSearch(){
    const query = searchInput.value.trim().toLowerCase();
    resultsContainer.innerHTML = '';
    if(!query){
      hideResults();
      return;
    }
    const matches = terms
      .map(term => ({ term, score: score(term, query) }))
      .filter(item => item.score > 0)
      .sort((a,b) => b.score - a.score);

    matches.forEach(({ term }) => {
      resultsContainer.appendChild(renderCard(term));
    });

    if (matches.length) {
      showResults();
    } else {
      hideResults();
    }
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

  function showResults(){
    resultsContainer.classList.remove('pointer-events-none');
    if (prefersReducedMotion || !window.motion) {
      resultsContainer.style.opacity = '1';
      return;
    }
    window.motion.animate(resultsContainer, { opacity: 1 }, { duration: 0.2, easing: 'ease-in-out' });
  }

  function hideResults(){
    if (prefersReducedMotion || !window.motion) {
      resultsContainer.style.opacity = '0';
      resultsContainer.classList.add('pointer-events-none');
      return;
    }
    window.motion
      .animate(resultsContainer, { opacity: 0 }, { duration: 0.2, easing: 'ease-in-out' })
      .finished.then(() => {
        resultsContainer.classList.add('pointer-events-none');
      });
  }
})();
