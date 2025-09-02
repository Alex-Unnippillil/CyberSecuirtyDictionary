const DB_NAME = 'csd-tags';
const DB_VERSION = 1;

export interface Tag {
  id?: number;
  name: string;
  color: string;
}

interface TermTags {
  term: string;
  tagIds: number[];
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject('indexedDB unavailable');
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('tags')) {
        db.createObjectStore('tags', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('termTags')) {
        db.createObjectStore('termTags', { keyPath: 'term' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getTags(): Promise<Tag[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('tags', 'readonly');
    const store = tx.objectStore('tags');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as Tag[]);
    req.onerror = () => reject(req.error);
  });
}

export async function saveTag(tag: Tag): Promise<Tag> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('tags', 'readwrite');
    const store = tx.objectStore('tags');
    const req = store.add(tag);
    req.onsuccess = () => resolve({ ...tag, id: req.result as number });
    req.onerror = () => reject(req.error);
  });
}

export async function getTermTags(term: string): Promise<number[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('termTags', 'readonly');
    const store = tx.objectStore('termTags');
    const req = store.get(term);
    req.onsuccess = () => {
      const data = req.result as TermTags | undefined;
      resolve(data?.tagIds || []);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function setTermTags(term: string, tagIds: number[]): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('termTags', 'readwrite');
    const store = tx.objectStore('termTags');
    const req = store.put({ term, tagIds });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getTagCounts(): Promise<Record<number, number>> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const counts: Record<number, number> = {};
    const tx = db.transaction('termTags', 'readonly');
    const store = tx.objectStore('termTags');
    const req = store.openCursor();
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        const data = cursor.value as TermTags;
        for (const id of data.tagIds) {
          counts[id] = (counts[id] || 0) + 1;
        }
        cursor.continue();
      } else {
        resolve(counts);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getTermsForTag(tagId: number): Promise<string[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const terms: string[] = [];
    const tx = db.transaction('termTags', 'readonly');
    const store = tx.objectStore('termTags');
    const req = store.openCursor();
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        const data = cursor.value as TermTags;
        if (data.tagIds.includes(tagId)) {
          terms.push(data.term);
        }
        cursor.continue();
      } else {
        resolve(terms);
      }
    };
    req.onerror = () => reject(req.error);
  });
}
