(() => {
  const SCROLL_KEY = "scroll-positions";
  const VERSION_KEY = "content-version";

  function storageKey() {
    return `${location.pathname}${location.hash}`;
  }

  function save() {
    try {
      const key = storageKey();
      const map = JSON.parse(localStorage.getItem(SCROLL_KEY) || "{}");
      map[key] = window.scrollY;
      localStorage.setItem(SCROLL_KEY, JSON.stringify(map));
    } catch (e) {
      // ignore storage errors
    }
  }

  function restore() {
    try {
      const key = storageKey();
      const map = JSON.parse(localStorage.getItem(SCROLL_KEY) || "{}");
      const y = map[key];
      if (typeof y === "number") {
        window.scrollTo(0, y);
      }
    } catch (e) {
      // ignore parse errors
    }
  }

  function clear() {
    try {
      localStorage.removeItem(SCROLL_KEY);
    } catch (e) {
      // ignore storage errors
    }
  }

  window.clearScrollPositions = clear;
  window.checkContentVersion = function (data) {
    try {
      const newVersion = JSON.stringify(data).length.toString();
      const oldVersion = localStorage.getItem(VERSION_KEY);
      if (oldVersion !== newVersion) {
        clear();
        localStorage.setItem(VERSION_KEY, newVersion);
      }
    } catch (e) {
      // ignore storage errors
    }
  };

  let timeout;
  window.addEventListener(
    "scroll",
    () => {
      clearTimeout(timeout);
      timeout = setTimeout(save, 100);
    },
    { passive: true },
  );

  window.addEventListener("beforeunload", save);
  window.addEventListener("hashchange", restore);
  document.addEventListener("DOMContentLoaded", restore);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js");
    });
  }
})();
