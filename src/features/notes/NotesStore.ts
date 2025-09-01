import { openDB, DBSchema } from 'idb';

export interface Note {
  id?: number;
  term: string;
  paragraph: number;
  content: string;
  tags: string[];
}

interface NotesDB extends DBSchema {
  notes: {
    key: number;
    value: Note;
    indexes: {
      'by-term': string;
      'by-tag': string;
    };
  };
}

export class NotesStore {
  private dbPromise = openDB<NotesDB>('csd-notes', 1, {
    upgrade(db) {
      const store = db.createObjectStore('notes', {
        keyPath: 'id',
        autoIncrement: true,
      });
      store.createIndex('by-term', 'term');
      store.createIndex('by-tag', 'tags', { multiEntry: true });
    },
  });

  async addNote(term: string, paragraph: number, content: string, tags: string[] = []): Promise<void> {
    const db = await this.dbPromise;
    await db.add('notes', { term, paragraph, content, tags });
  }

  async getNotesForTerm(term: string): Promise<Note[]> {
    const db = await this.dbPromise;
    return db.getAllFromIndex('notes', 'by-term', term);
  }

  async getAllNotes(): Promise<Note[]> {
    const db = await this.dbPromise;
    return db.getAll('notes');
  }

  async searchTermsByContentOrTags(query: string): Promise<Set<string>> {
    const lower = query.toLowerCase();
    const db = await this.dbPromise;
    const tx = db.transaction('notes');
    const store = tx.store;
    const terms = new Set<string>();
    let cursor = await store.openCursor();
    while (cursor) {
      const note = cursor.value as Note;
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

  async getTermsByTag(tag: string): Promise<Set<string>> {
    const db = await this.dbPromise;
    const notes = await db.getAllFromIndex('notes', 'by-tag', tag);
    return new Set(notes.map((n) => n.term));
  }
}

const notesStore = new NotesStore();
// Expose globally for non-module scripts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).notesStore = notesStore;
export default notesStore;
