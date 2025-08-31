if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

// Custom install banner with weekly frequency cap
(function () {
  const PROMPT_KEY = "installPromptTimestamp";
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  let deferredPrompt;

  function shouldPrompt() {
    try {
      const last = parseInt(localStorage.getItem(PROMPT_KEY), 10);
      return !last || Date.now() - last > WEEK_MS;
    } catch (e) {
      return true;
    }
  }

  function markPromptShown() {
    try {
      localStorage.setItem(PROMPT_KEY, Date.now().toString());
    } catch (e) {
      // Ignore storage errors
    }
  }

  function createBanner(message, actionText, action) {
    const banner = document.createElement("div");
    banner.className = "install-banner";

    const text = document.createElement("span");
    text.textContent = message;

    const actions = document.createElement("div");
    const btn = document.createElement("button");
    btn.textContent = actionText;
    btn.addEventListener("click", () => {
      action();
      banner.remove();
    });

    const close = document.createElement("button");
    close.textContent = "✕";
    close.addEventListener("click", () => banner.remove());

    actions.appendChild(btn);
    actions.appendChild(close);

    banner.appendChild(text);
    banner.appendChild(actions);
    document.body.appendChild(banner);
    markPromptShown();
  }

  // Desktop install prompt
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    if (!shouldPrompt()) {
      return;
    }
    deferredPrompt = e;
    createBanner("Install Cyber Security Dictionary?", "Install", () => {
      deferredPrompt.prompt();
      deferredPrompt = null;
    });
  });

  // iOS installation instructions
  const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone;
  if (isIos && !isStandalone && shouldPrompt()) {
    createBanner(
      "Install this app: tap Share then Add to Home Screen.",
      "Dismiss",
      () => {},
    );
  }
})();
