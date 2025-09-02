export type BacklinkMap = Record<string, string[]>;

const DB_NAME = 'csd';
const STORE_NAME = 'backlinks';
const KEY = 'data';

async function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadBacklinks(): Promise<BacklinkMap> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(KEY);
    getReq.onsuccess = async () => {
      if (getReq.result) {
        resolve(getReq.result as BacklinkMap);
      } else {
        try {
          const resp = await fetch('/backlinks.json');
          const json = (await resp.json()) as BacklinkMap;
          const wtx = db.transaction(STORE_NAME, 'readwrite');
          wtx.objectStore(STORE_NAME).put(json, KEY);
          resolve(json);
        } catch (err) {
          reject(err);
        }
      }
    };
    getReq.onerror = () => reject(getReq.error);
  });
}
