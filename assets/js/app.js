if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then((registration) => {
      const notifyUpdate = () =>
        window.dispatchEvent(
          new CustomEvent("swUpdated", { detail: registration }),
        );

      if (registration.waiting) {
        notifyUpdate();
      }

      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        newWorker?.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            notifyUpdate();
          }
        });
      });
    });
  });
}
