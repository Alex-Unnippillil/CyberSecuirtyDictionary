const STORAGE_KEY = 'collections';

function loadCollections() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveCollections(collections) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  } catch (e) {
    // Ignore storage errors
  }
}

function createCollection(name) {
  const id = Date.now().toString(36);
  const collections = loadCollections();
  collections[id] = { id, name, items: [] };
  saveCollections(collections);
  return collections[id];
}

function getCollection(id) {
  const collections = loadCollections();
  return collections[id] || null;
}

function updateCollection(id, data) {
  const collections = loadCollections();
  if (!collections[id]) return null;
  collections[id] = { ...collections[id], ...data };
  saveCollections(collections);
  return collections[id];
}

function deleteCollection(id) {
  const collections = loadCollections();
  if (!collections[id]) return;
  delete collections[id];
  saveCollections(collections);
}

function addItemToCollection(id, item) {
  const collections = loadCollections();
  if (!collections[id]) return;
  if (!collections[id].items.includes(item)) {
    collections[id].items.push(item);
    saveCollections(collections);
  }
}

function removeItemFromCollection(id, item) {
  const collections = loadCollections();
  if (!collections[id]) return;
  collections[id].items = collections[id].items.filter((i) => i !== item);
  saveCollections(collections);
}

function getCollectionUrl(id, readonly = false) {
  const base = `${window.location.origin}/collections/${id}`;
  return readonly ? `${base}?readonly=1` : base;
}

function renderCollectionBadges() {
  const container = document.getElementById('collections-badges');
  if (!container) return;
  container.innerHTML = '';
  const collections = loadCollections();
  Object.values(collections).forEach((c) => {
    const link = document.createElement('a');
    link.href = `/collections/${c.id}`;
    link.className = 'collection-badge';
    link.textContent = c.name;
    const count = document.createElement('span');
    count.className = 'count';
    count.textContent = c.items.length;
    link.appendChild(count);
    container.appendChild(link);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCollectionBadges();
});

window.CollectionsFeature = {
  loadCollections,
  saveCollections,
  createCollection,
  getCollection,
  updateCollection,
  deleteCollection,
  addItemToCollection,
  removeItemFromCollection,
  renderCollectionBadges,
  getCollectionUrl,
};
