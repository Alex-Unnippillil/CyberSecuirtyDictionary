(function () {
  const html = document.documentElement;
  function flagLowGpu() {
    if (!html.hasAttribute("data-gpu")) {
      html.setAttribute("data-gpu", "low");
    }
  }

  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  if (connection) {
    if (connection.rtt && connection.rtt > 300) {
      flagLowGpu();
    }
    if (connection.effectiveType && /2g/.test(connection.effectiveType)) {
      flagLowGpu();
    }
    if (connection.saveData) {
      flagLowGpu();
    }
  }

  if (window.webVitals && typeof window.webVitals.onINP === "function") {
    window.webVitals.onINP(({ value }) => {
      if (value > 200) {
        flagLowGpu();
      }
    });
  }
})();
