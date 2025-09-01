;(function () {
  const KEY = 'web-vitals';
  const MAX_VISIBLE = 10;

  // expose for tests
  window.__MAX_HISTORY_VISIBLE__ = MAX_VISIBLE;

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

    const hiddenRows = [];
    const visibleStart = Math.max(0, samples.length - MAX_VISIBLE);
    samples.forEach((s, idx) => {
      const tr = document.createElement('tr');
      const date = new Date(s.timestamp).toISOString();
      const lcp = s.lcp != null && s.lcp.toFixed ? s.lcp.toFixed(2) : s.lcp;
      const cls = s.cls != null && s.cls.toFixed ? s.cls.toFixed(3) : s.cls;
      const tbt = s.tbt != null && s.tbt.toFixed ? s.tbt.toFixed(2) : s.tbt;
      tr.innerHTML = `<td>${date}</td><td>${lcp}</td><td>${cls}</td><td>${tbt}</td>`;
      if (idx < visibleStart) {
        tr.classList.add('hidden-history');
        hiddenRows.push(tr);
      } else {
        tbody.appendChild(tr);
      }
    });

    if (hiddenRows.length) {
      const foldRow = document.createElement('tr');
      foldRow.className = 'history-fold';
      foldRow.innerHTML = `<td colspan="4"><button type="button" class="fold-toggle">Show ${hiddenRows.length} older entries</button></td>`;
      tbody.insertBefore(foldRow, tbody.firstChild);
      hiddenRows.forEach((row) => tbody.insertBefore(row, foldRow));

      let expanded = false;
      const toggleBtn = foldRow.querySelector('.fold-toggle');
      toggleBtn.addEventListener('click', () => {
        expanded = !expanded;
        hiddenRows.forEach((row) => {
          if (expanded) {
            row.classList.add('revealed');
          } else {
            row.classList.remove('revealed');
          }
        });
        toggleBtn.textContent = expanded
          ? 'Hide older entries'
          : `Show ${hiddenRows.length} older entries`;
      });
    }
  }

  window.renderDiagnostics = renderDiagnostics;
  window.addEventListener('DOMContentLoaded', renderDiagnostics);
})();
