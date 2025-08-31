if ("serviceWorker" in navigator) {
  const hasReloaded = sessionStorage.getItem("sw-reloaded") === "true";
  if (hasReloaded) {
    sessionStorage.removeItem("sw-reloaded");
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (
        event.data &&
        event.data.type === "UPDATE_AVAILABLE" &&
        !hasReloaded
      ) {
        showUpdateToast();
      }
    });
  });
}

function showUpdateToast() {
  if (document.getElementById("update-toast")) return;
  const toast = document.createElement("div");
  toast.id = "update-toast";
  toast.innerHTML =
    '<span>New version available.</span><button id="refresh-app">Refresh</button>';
  document.body.appendChild(toast);
  document.getElementById("refresh-app").addEventListener("click", () => {
    sessionStorage.setItem("sw-reloaded", "true");
    window.location.reload();
  });
}
