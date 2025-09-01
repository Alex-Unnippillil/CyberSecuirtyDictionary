(function(){
  const resultsContainer = document.getElementById('results');
  const searchInput = document.getElementById('search-box');
  const aliasForm = document.getElementById('alias-form');
  const aliasInput = document.getElementById('alias-name');
  const aliasTargetInput = document.getElementById('alias-target');
  const aliasList = document.getElementById('alias-list');
  let terms = [];
  let aliases = {};

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

    aliases = JSON.parse(localStorage.getItem('aliases') || '{}');
    renderAliasList();

    searchInput.addEventListener('input', handleSearch);
    aliasForm.addEventListener('submit', saveAlias);
  });

  function handleSearch(){
    const query = searchInput.value.trim().toLowerCase();
    resultsContainer.innerHTML = '';
    if(!query){
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const diff = parseInt(params.get('difficulty') || '0', 10);

    let filtered = terms;
    if (diff > 0) {
      filtered = terms.filter(t => {
        const td = typeof t.difficulty === 'number' ? t.difficulty : 0;
        return td <= diff;
      });
    }

    const matches = filtered
      .map(term => ({ term, score: score(term, query) }))
      .filter(item => item.score > 0);

    const aliasMatches = Object.entries(aliases)
      .filter(([a]) => a.toLowerCase().includes(query))
      .map(([a,t]) => {
        const term = terms.find(tt => (tt.name || tt.term || '').toLowerCase() === t.toLowerCase());
        return term ? { term, score: 4, alias: a } : null;
      })
      .filter(Boolean);

    const resultMap = new Map();
    matches.forEach(({term, score}) => {
      resultMap.set(term.name || term.term || '', {term, score});
    });
    aliasMatches.forEach(({term, score, alias}) => {
      const key = term.name || term.term || '';
      const existing = resultMap.get(key);
      if(existing){
        existing.score = Math.max(existing.score, score);
        existing.alias = alias;
      } else {
        resultMap.set(key, {term, score, alias});
      }
    });

    Array.from(resultMap.values())
      .sort((a,b) => b.score - a.score)
      .forEach(({term, alias}) => {
        resultsContainer.appendChild(renderCard(term, alias));
      });
  }

  window.__handleSearch = handleSearch;

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

  function renderCard(term, matchedAlias){
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

    if(matchedAlias){
      const note = document.createElement('p');
      note.className = 'alias-note';
      note.textContent = 'Matched by alias';
      card.appendChild(note);
    }
    return card;
  }

  function saveAlias(e){
    e.preventDefault();
    const alias = aliasInput.value.trim();
    const target = aliasTargetInput.value.trim();
    if(!alias || !target) return;
    aliases[alias] = target;
    try{
      localStorage.setItem('aliases', JSON.stringify(aliases));
    }catch(err){
      console.error('Failed to save aliases', err);
    }
    aliasInput.value = '';
    aliasTargetInput.value = '';
    renderAliasList();
  }

  function renderAliasList(){
    if(!aliasList) return;
    aliasList.innerHTML = '';
    Object.entries(aliases).forEach(([alias, term]) => {
      const li = document.createElement('li');
      li.textContent = `${alias} → ${term}`;
      const edit = document.createElement('button');
      edit.textContent = 'Edit';
      edit.addEventListener('click', () => {
        aliasInput.value = alias;
        aliasTargetInput.value = term;
      });
      const del = document.createElement('button');
      del.textContent = 'Delete';
      del.addEventListener('click', () => {
        delete aliases[alias];
        try{
          localStorage.setItem('aliases', JSON.stringify(aliases));
        }catch(err){
          console.error('Failed to save aliases', err);
        }
        renderAliasList();
        handleSearch();
      });
      li.appendChild(edit);
      li.appendChild(del);
      aliasList.appendChild(li);
    });
  }
})();
