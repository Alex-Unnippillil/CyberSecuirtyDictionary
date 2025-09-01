export class SavedSearches {
  constructor(storageKey = 'saved-searches') {
    this.storageKey = storageKey;
    this.searches = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  _persist() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.searches));
    } catch (e) {
      // ignore storage failures
    }
  }

  add(search) {
    this.searches.push({ ...search, id: Date.now().toString(), starred: false });
    this._persist();
  }

  update(id, updates) {
    const item = this.searches.find((s) => s.id === id);
    if (item) {
      Object.assign(item, updates);
      this._persist();
    }
  }

  remove(id) {
    this.searches = this.searches.filter((s) => s.id !== id);
    this._persist();
  }

  reorder(from, to) {
    if (from === to) return;
    const list = this.searches;
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    this._persist();
  }
}
