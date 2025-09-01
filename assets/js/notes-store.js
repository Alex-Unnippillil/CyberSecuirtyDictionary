import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@7/+esm';

class NotesStore {
  constructor() {
    this.dbPromise = openDB('csd-notes', 1, {
      upgrade(db) {
        const store = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
        store.createIndex('by-term', 'term');
        store.createIndex('by-tag', 'tags', { multiEntry: true });
      },
    });
  }

  async addNote(term, paragraph, content, tags = []) {
    const db = await this.dbPromise;
    await db.add('notes', { term, paragraph, content, tags });
  }

  async getNotesForTerm(term) {
    const db = await this.dbPromise;
    return db.getAllFromIndex('notes', 'by-term', term);
  }

  async getAllNotes() {
    const db = await this.dbPromise;
    return db.getAll('notes');
  }

  async searchTermsByContentOrTags(query) {
    const lower = query.toLowerCase();
    const db = await this.dbPromise;
    const tx = db.transaction('notes');
    const store = tx.store;
    const terms = new Set();
    let cursor = await store.openCursor();
    while (cursor) {
      const note = cursor.value;
      if (
        note.content.toLowerCase().includes(lower) ||
        note.tags.some((t) => t.toLowerCase().includes(lower))
      ) {
        terms.add(note.term);
      }
      cursor = await cursor.continue();
    }
    await tx.done;
    return terms;
  }

  async getTermsByTag(tag) {
    const db = await this.dbPromise;
    const notes = await db.getAllFromIndex('notes', 'by-tag', tag);
    return new Set(notes.map((n) => n.term));
  }
}

const notesStore = new NotesStore();
window.notesStore = notesStore;
export default notesStore;
