const CACHE_PREFIX = "csd-collection-";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        })
      );
    }),
  );
});

function notifyClients(message) {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => client.postMessage(message));
  });
}

async function cacheCollection(name, urls) {
  const cache = await caches.open(CACHE_PREFIX + name);
  let count = 0;
  let totalSize = 0;
  for (const url of urls) {
    try {
      const response = await fetch(url);
      await cache.put(url, response.clone());
      let size = 0;
      const len = response.headers.get("content-length");
      if (len) {
        size = parseInt(len, 10);
      } else {
        const buf = await response.clone().arrayBuffer();
        size = buf.byteLength;
      }
      totalSize += size;
    } catch (err) {
      // ignore errors and continue
    }
    count++;
    notifyClients({
      type: "CACHE_PROGRESS",
      name,
      index: count,
      total: urls.length,
    });
  }
  notifyClients({
    type: "CACHE_COMPLETE",
    name,
    total: urls.length,
    size: totalSize,
  });
}

self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data) return;
  if (data.type === "CACHE_COLLECTION") {
    cacheCollection(data.name, data.urls);
  } else if (data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
