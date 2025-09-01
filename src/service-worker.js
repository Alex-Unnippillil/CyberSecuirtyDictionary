const CACHE_NAME = "csd-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/assets/js/app.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CACHE_COLLECTION") {
    const { url } = event.data;
    event.waitUntil(cacheCollection(url, event));
  }
});

async function cacheCollection(url, event) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(url);
    const total = Number(response.headers.get("content-length")) || 0;
    if (event.ports[0]) {
      event.ports[0].postMessage({
        type: "CACHE_PROGRESS",
        url,
        received: 0,
        total,
      });
    }
    let received = 0;
    const reader = response.body.getReader();
    const stream = new ReadableStream({
      start(controller) {
        function push() {
          reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            received += value.byteLength;
            event.ports[0]?.postMessage({
              type: "CACHE_PROGRESS",
              url,
              received,
              total,
            });
            controller.enqueue(value);
            push();
          });
        }
        push();
      },
    });
    const newResponse = new Response(stream, { headers: response.headers });
    await cache.put(url, newResponse.clone());
    event.ports[0]?.postMessage({ type: "CACHE_COMPLETE", url, size: total });
  } catch (err) {
    event.ports[0]?.postMessage({
      type: "CACHE_ERROR",
      url,
      error: err.message,
    });
  }
}
