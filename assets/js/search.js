import { SavedSearches } from './saved-searches.js';

const resultsContainer = document.getElementById('results');
const searchInput = document.getElementById('search-box');
const saveBtn = document.getElementById('save-search');
const savedContainer = document.getElementById('saved-searches');

let terms = [];
const store = new SavedSearches();

document.addEventListener('DOMContentLoaded', () => {
  const baseUrl = window.__BASE_URL__ || '';
  fetch(`${baseUrl}/terms.json`)
    .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
    .then((data) => {
      // terms.json may either be an array or object with terms property
      terms = Array.isArray(data) ? data : data.terms || [];
    })
    .catch((err) => {
      console.error('Failed to load terms.json', err);
    });

  searchInput.addEventListener('input', handleSearch);
  saveBtn.addEventListener('click', saveCurrentSearch);
  renderSavedSearches();
});

function handleSearch() {
  const query = searchInput.value.trim().toLowerCase();
  resultsContainer.innerHTML = '';
  if (!query) {
    return;
  }
  const matches = terms
    .map((term) => ({ term, score: score(term, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  matches.forEach(({ term }) => {
    resultsContainer.appendChild(renderCard(term));
  });
}

function score(term, query) {
  let s = 0;
  const name = (term.name || term.term || '').toLowerCase();
  const def = (term.definition || '').toLowerCase();
  const category = (term.category || '').toLowerCase();
  const syns = (term.synonyms || []).map((s) => s.toLowerCase());
  if (name.includes(query)) s += 3;
  if (def.includes(query)) s += 1;
  if (category.includes(query)) s += 1;
  if (syns.some((syn) => syn.includes(query))) s += 2;
  return s;
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

function saveCurrentSearch() {
  const query = searchInput.value.trim();
  if (!query) return;
  const name = prompt('Name for saved search', query);
  if (!name) return;
  store.add({ name, query });
  renderSavedSearches();
}

function renderSavedSearches() {
  savedContainer.innerHTML = '';
  store.searches.forEach((s, index) => {
    const chip = document.createElement('span');
    chip.className = 'saved-search-chip';
    chip.draggable = true;
    chip.dataset.index = index;

    const label = document.createElement('span');
    label.textContent = s.name;
    chip.appendChild(label);

    const star = document.createElement('span');
    star.className = 'star' + (s.starred ? ' starred' : '');
    star.textContent = '★';
    star.addEventListener('click', (e) => {
      e.stopPropagation();
      store.update(s.id, { starred: !s.starred });
      renderSavedSearches();
    });
    chip.appendChild(star);

    chip.addEventListener('click', () => {
      searchInput.value = s.query;
      handleSearch();
    });

    chip.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', index.toString());
    });

    chip.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    chip.addEventListener('drop', (e) => {
      e.preventDefault();
      const from = parseInt(e.dataTransfer.getData('text/plain'), 10);
      const to = index;
      store.reorder(from, to);
      renderSavedSearches();
    });

    savedContainer.appendChild(chip);
  });
}

