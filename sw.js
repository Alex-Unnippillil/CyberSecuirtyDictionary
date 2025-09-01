const CACHE_NAME = 'csd-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/data.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
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
    caches.match(event.request).then(response =>
      response || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
    )
  );
});

// Handle incoming push messages and display a notification.
self.addEventListener('push', event => {
  const data = (() => {
    try {
      return event.data ? event.data.json() : {};
    } catch (_err) {
      return {};
    }
  })();
  const title = data.title || 'Dictionary update';
  const options = {
    body: data.body || 'A term has been added or updated.',
    data: data.url || '/',
    icon: '/assets/icon-192.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Allow users to navigate to a url after clicking the notification
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
