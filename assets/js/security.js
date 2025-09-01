(function () {
  const bannerId = "security-warning";

  function ensureBanner() {
    let banner = document.getElementById(bannerId);
    if (!banner) {
      banner = document.createElement("div");
      banner.id = bannerId;
      banner.className = "warning-banner";
      banner.setAttribute("role", "alert");
      banner.style.display = "none";
      document.body.prepend(banner);
    }
    return banner;
  }

  function showWarning(message) {
    const banner = ensureBanner();
    banner.textContent = message;
    banner.style.display = "block";
  }

  function hideWarning() {
    const banner = document.getElementById(bannerId);
    if (banner) {
      banner.style.display = "none";
    }
  }

  function redactSecrets(text) {
    return text.replace(/(sk-[a-z0-9]{20,})/gi, "[REDACTED]");
  }

  function detectExfiltration(text) {
    const patterns = [
      /exfiltrate/i,
      /curl\s+https?:\/\//i,
      /wget\s+https?:\/\//i,
      /BEGIN\s+PRIVATE\s+KEY/i,
      /\b(?:password|api[_-]?key|secret)\b/i,
    ];
    return patterns.some((p) => p.test(text));
  }

  function process(input) {
    const redacted = redactSecrets(input);
    const suspicious = detectExfiltration(input);
    if (suspicious) {
      showWarning("Suspicious input detected.");
    } else {
      hideWarning();
    }
    return redacted;
  }

  window.SecurityMiddleware = {
    process,
    redactSecrets,
    detectExfiltration,
    showWarning,
    hideWarning,
  };
})();
