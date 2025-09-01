if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/src/service-worker.js", { scope: "/" });
  });
}
