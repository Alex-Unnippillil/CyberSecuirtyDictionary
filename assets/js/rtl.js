(function () {
  const rtlLangs = [
    'ar', 'he', 'fa', 'ur', 'ps', 'sd', 'ug', 'dv', 'yi'
  ];
  const htmlEl = document.documentElement;
  const lang = (htmlEl.getAttribute('lang') || navigator.language || '').toLowerCase();
  if (rtlLangs.some(l => lang.startsWith(l))) {
    htmlEl.setAttribute('dir', 'rtl');
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input, textarea').forEach((el) => {
      el.setAttribute('dir', 'auto');
      el.style.unicodeBidi = 'plaintext';
    });
  });
})();
