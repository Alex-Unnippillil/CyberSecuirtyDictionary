const CACHE_NAME = "csd-cache-v1";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/data.json",
];

async function fetchWithRetry(
  input,
  init = {},
  maxAttempts = 3,
  baseDelay = 500,
  cap = 10000,
) {
  let attempt = 0;
  let delay = baseDelay;
  let lastError;
  while (attempt < maxAttempts) {
    try {
      const res = await fetch(input, init);
      if (res.status !== 429 && res.status < 500) {
        return res;
      }
      lastError = new Error(`HTTP error! status: ${res.status}`);
    } catch (err) {
      lastError = err;
    }
    attempt++;
    if (attempt >= maxAttempts) {
      throw lastError;
    }
    const jitter = Math.random() * (delay * 3 - baseDelay) + baseDelay;
    delay = Math.min(cap, jitter);
    await new Promise((r) => setTimeout(r, delay));
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE)),
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
    caches.match(event.request).then(
      (response) =>
        response ||
        fetchWithRetry(event.request).catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        }),
    ),
  );
});
