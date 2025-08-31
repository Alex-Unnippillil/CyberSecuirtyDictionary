if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

window.addEventListener("appinstalled", () => {
  if (typeof sendAnalyticsEvent === "function") {
    sendAnalyticsEvent("install");
  }
});
