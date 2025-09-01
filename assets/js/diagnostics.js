(function () {
  const KEY = "web-vitals";
  const FPS_KEY = "fps-metrics";

  function renderDiagnostics() {
    const tbody = document.getElementById("metrics-body");
    if (!tbody) return;
    let samples = [];
    try {
      samples = JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch (e) {
      samples = [];
    }
    tbody.innerHTML = "";
    samples.forEach((s) => {
      const tr = document.createElement("tr");
      const date = new Date(s.timestamp).toISOString();
      const lcp = s.lcp != null && s.lcp.toFixed ? s.lcp.toFixed(2) : s.lcp;
      const cls = s.cls != null && s.cls.toFixed ? s.cls.toFixed(3) : s.cls;
      const tbt = s.tbt != null && s.tbt.toFixed ? s.tbt.toFixed(2) : s.tbt;
      tr.innerHTML = `<td>${date}</td><td>${lcp}</td><td>${cls}</td><td>${tbt}</td>`;
      tbody.appendChild(tr);
    });

    renderFps();
  }

  function renderFps() {
    const tbody = document.getElementById("fps-body");
    if (!tbody) return;
    let samples = [];
    try {
      samples = JSON.parse(localStorage.getItem(FPS_KEY) || "[]");
    } catch (e) {
      samples = [];
    }
    const byRoute = {};
    samples.forEach((s) => {
      if (!byRoute[s.route]) byRoute[s.route] = [];
      byRoute[s.route].push(s.fps);
    });
    tbody.innerHTML = "";
    Object.keys(byRoute).forEach((route) => {
      const fpsList = byRoute[route].sort((a, b) => a - b);
      const mid = Math.floor(fpsList.length / 2);
      const median =
        fpsList.length % 2
          ? fpsList[mid]
          : (fpsList[mid - 1] + fpsList[mid]) / 2;
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${route}</td><td>${median.toFixed(1)}</td>`;
      tbody.appendChild(tr);
    });
  }

  window.renderDiagnostics = renderDiagnostics;
  window.addEventListener("DOMContentLoaded", renderDiagnostics);
})();
