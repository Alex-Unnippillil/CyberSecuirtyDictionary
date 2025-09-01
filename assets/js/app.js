if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then((registration) => {
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        newWorker?.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            window.dispatchEvent(
              new CustomEvent("swUpdated", { detail: registration }),
            );
          }
        });
      });
    });
  });
}

// --- Global key sequence handler ---
const KEY_SEQ_TIMEOUT = 1000;
let pendingG = false;
let gTimer;

window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (pendingG) {
    pendingG = false;
    clearTimeout(gTimer);
    if (key === "t") {
      window.location.href = "/";
    } else if (key === "c") {
      window.location.href = "/collections";
    }
    return;
  }

  if (key === "g") {
    pendingG = true;
    gTimer = setTimeout(() => {
      pendingG = false;
    }, KEY_SEQ_TIMEOUT);
  }
});
