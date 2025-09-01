(function () {
  const KEY = "web-vitals";

  function renderDiagnostics() {
    const tbody = document.getElementById("metrics-body");
    if (tbody) {
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
    }

    const animBody = document.getElementById("animations-body");
    if (animBody) {
      let data = {};
      try {
        data = JSON.parse(localStorage.getItem("animation-metrics") || "{}");
      } catch (e) {
        data = {};
      }
      animBody.innerHTML = "";
      Object.entries(data).forEach(([name, stats]) => {
        const total = stats.completed + stats.dropped;
        const rate = total
          ? ((stats.completed / total) * 100).toFixed(1) + "%"
          : "0%";
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${name}</td><td>${stats.completed}</td><td>${stats.dropped}</td><td>${rate}</td>`;
        if (total >= 5 && stats.completed / total < 0.5) {
          tr.style.color = "red";
        }
        animBody.appendChild(tr);
      });
    }
  }

  window.renderDiagnostics = renderDiagnostics;
  window.addEventListener("DOMContentLoaded", renderDiagnostics);
})();
