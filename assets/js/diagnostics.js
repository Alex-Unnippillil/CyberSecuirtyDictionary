(function () {
  const KEY = 'web-vitals';

  function renderDiagnostics() {
    const tbody = document.getElementById('metrics-body');
    if (!tbody) return;
    let samples = [];
    try {
      samples = JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch (e) {
      samples = [];
    }
    tbody.innerHTML = '';
    samples.forEach((s) => {
      const tr = document.createElement('tr');
      const date = new Date(s.timestamp).toISOString();
      const lcp = s.lcp != null && s.lcp.toFixed ? s.lcp.toFixed(2) : s.lcp;
      const cls = s.cls != null && s.cls.toFixed ? s.cls.toFixed(3) : s.cls;
      const tbt = s.tbt != null && s.tbt.toFixed ? s.tbt.toFixed(2) : s.tbt;
      const tti = s.tti != null && s.tti.toFixed ? s.tti.toFixed(2) : s.tti;
      tr.innerHTML = `<td>${date}</td><td>${lcp}</td><td>${cls}</td><td>${tbt}</td><td>${tti}</td>`;
      tbody.appendChild(tr);
    });
  }

  window.renderDiagnostics = renderDiagnostics;
  window.addEventListener('DOMContentLoaded', renderDiagnostics);
})();
