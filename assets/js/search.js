(function(){
  const resultsContainer = document.getElementById('results');
  const searchInput = document.getElementById('search-box');
  const TOP_K = 10;
  let terms = [];
  let stats = null;
  let pagefind = null;

  document.addEventListener('DOMContentLoaded', async () => {
    const baseUrl = window.__BASE_URL__ || '';
    try {
      const data = await fetch(`${baseUrl}/terms.json`).then(r => r.ok ? r.json() : Promise.reject(r.statusText));
      terms = Array.isArray(data) ? data : (data.terms || []);
      const built = BM25.buildIndex(terms);
      stats = { docFreq: built.docFreq, avgDocLen: built.avgDocLen, N: terms.length };
    } catch(err) {
      console.error('Failed to load terms.json', err);
    }

    try {
      pagefind = await import(`${baseUrl}/pagefind/pagefind.js`);
      if (pagefind && pagefind.init) {
        await pagefind.init();
      }
    } catch(err) {
      console.warn('Pagefind not available, falling back to local search', err);
      pagefind = null;
    }

    searchInput.addEventListener('input', handleSearch);
  });

  async function handleSearch(){
    const query = searchInput.value.trim().toLowerCase();
    resultsContainer.innerHTML = '';
    if(!query){
      return;
    }

    if(pagefind){
      const res = await pagefind.search(query);
      const hits = await Promise.all(res.results.slice(0, TOP_K).map(r => r.data()));
      const queryTokens = BM25.tokenize(query);
      const ranked = hits.map(h => {
        const title = h.meta && h.meta.title ? h.meta.title : '';
        const termData = terms.find(t => (t.term || '').toLowerCase() === title.toLowerCase());
        const definition = termData ? termData.definition : '';
        const tokens = BM25.tokenize(`${title} ${definition}`);
        const score = stats ? BM25.scoreDocument(tokens, queryTokens, stats) : 0;
        return { term: termData || { term: title, definition }, score };
      }).sort((a,b) => b.score - a.score);

      ranked.forEach(({term}) => {
        resultsContainer.appendChild(renderCard(term));
      });
    } else {
      const matches = terms
        .map(term => ({ term, score: score(term, query) }))
        .filter(item => item.score > 0)
        .sort((a,b) => b.score - a.score);

      matches.forEach(({ term }) => {
        resultsContainer.appendChild(renderCard(term));
      });
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
})();
