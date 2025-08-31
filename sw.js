const CACHE_NAME = 'csd-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/terms.json',
  '/assets/js/search.js',
  '/_pagefind/pagefind.js',
  '/_pagefind/pagefind.wasm',
  '/_pagefind/en.json',
  '/_pagefind/pagefind.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(
        URLS_TO_CACHE.map(url =>
          cache.add(url).catch(err => console.warn('Failed to cache', url, err))
        )
      )
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, { ignoreMethod: true }).then(response =>
      response || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
    )
  );
});
