(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('direction-toggle');
    if (!toggle) return;

    const apply = (dir) => document.documentElement.setAttribute('dir', dir);
    const updateText = (dir) => {
      toggle.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    };

    const saved = localStorage.getItem('direction') || 'ltr';
    apply(saved);
    updateText(saved);

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
      apply(current);
      updateText(current);
      try {
        localStorage.setItem('direction', current);
      } catch (e) {
        // ignore storage errors
      }
    });
  });
})();
