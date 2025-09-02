import { openDB, DBSchema } from 'idb';

export interface PersonalTerm {
  slug: string;
  definition: string;
  tags: string[];
  source: string;
}

interface PersonalTermsDB extends DBSchema {
  terms: {
    key: string;
    value: PersonalTerm;
    indexes: { 'by-slug': string };
  };
}

const DB_NAME = 'personal-terms';
const DB_VERSION = 1;
const STORE_NAME = 'terms';

async function getDB() {
  return openDB<PersonalTermsDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'slug' });
      store.createIndex('by-slug', 'slug');
    },
  });
}

export async function savePersonalTerm(term: PersonalTerm) {
  const db = await getDB();
  await db.put(STORE_NAME, term);
}

export async function getAllPersonalTerms(): Promise<PersonalTerm[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function searchPersonalTerms(query: string): Promise<PersonalTerm[]> {
  const q = query.toLowerCase();
  const all = await getAllPersonalTerms();
  return all.filter(
    (t) =>
      t.slug.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q)
  );
}

