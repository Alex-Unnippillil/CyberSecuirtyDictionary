// Register the service worker and expose a helper to query cache metrics.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data && event.data.type === "CACHE_HIT_COUNT") {
      console.log("Cache hits:", event.data.count);
    }
  });

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(() => {
      measureCacheHits();
    });
  });
}

// Measure cache hits by asking the service worker for its current count.
function measureCacheHits() {
  if (navigator.serviceWorker.controller) {
    const channel = new MessageChannel();
    channel.port1.onmessage = (event) => {
      console.log("Cache hits:", event.data.count);
    };
    navigator.serviceWorker.controller.postMessage({ type: "GET_CACHE_HITS" }, [
      channel.port2,
    ]);
  }
}

// Helper wrapper around requestIdleCallback with a fallback.
function requestIdle(fn) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(fn);
  } else {
    setTimeout(fn, 1);
  }
}

// Prefetch a given URL using a <link rel="prefetch"> tag.
function prefetch(href) {
  const connection = navigator.connection;
  if (connection) {
    if (connection.saveData || /2g/.test(connection.effectiveType)) {
      return; // Avoid prefetching on poor connections or data-saver.
    }
  }
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = href;
  document.head.appendChild(link);
}

// Detect potential next navigations and prefetch their assets during idle time.
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("a[href]").forEach((anchor) => {
    const href = anchor.href;
    const trigger = () => requestIdle(() => prefetch(href));
    anchor.addEventListener("mouseenter", trigger, { once: true });
    anchor.addEventListener("touchstart", trigger, { once: true });
  });
});
