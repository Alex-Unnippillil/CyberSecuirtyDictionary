importScripts("analytics.js");

const CACHE_NAME = "csd-cache-v1";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/data.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE)),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      const oldKeys = keys.filter((key) => key !== CACHE_NAME);
      if (oldKeys.length > 0 && typeof sendAnalyticsEvent === "function") {
        sendAnalyticsEvent("update-accepted");
      }
      return Promise.all(oldKeys.map((key) => caches.delete(key)));
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (response) =>
        response ||
        fetch(event.request).catch(() => {
          if (event.request.mode === "navigate") {
            if (typeof sendAnalyticsEvent === "function") {
              sendAnalyticsEvent("offline-used");
            }
            return caches.match("/index.html");
          }
        }),
    ),
  );
});
