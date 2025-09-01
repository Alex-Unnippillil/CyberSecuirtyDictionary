(function () {
  const STORAGE_KEY = 'liteMode';
  const toggle = document.getElementById('lite-mode-toggle');
  const badge = document.getElementById('lite-mode-badge');

  function apply(on) {
    document.body.classList.toggle('lite-mode', on);
    if (badge) {
      badge.style.display = on ? 'block' : 'none';
    }
    try {
      localStorage.setItem(STORAGE_KEY, on);
    } catch (e) {
      /* ignore storage errors */
    }
  }

  let enabled = false;
  try {
    enabled = localStorage.getItem(STORAGE_KEY) === 'true';
  } catch (e) {
    enabled = false;
  }
  apply(enabled);

  if (toggle) {
    toggle.addEventListener('click', () => {
      enabled = !document.body.classList.contains('lite-mode');
      apply(enabled);
    });
  }
})();
