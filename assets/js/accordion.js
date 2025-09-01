function setupAccordion(root) {
  const headers = Array.from(root.querySelectorAll('.accordion-header'));
  headers.forEach((header, i) => {
    const panel = header.nextElementSibling;
    header.setAttribute('aria-expanded', 'false');
    header.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        close(panel);
      } else {
        open(panel);
      }
    });
    header.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        headers[(i + 1) % headers.length].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        headers[(i - 1 + headers.length) % headers.length].focus();
      }
    });
  });

  function open(panel) {
    panel.hidden = false;
    const height = panel.scrollHeight;
    panel.style.height = height + 'px';
    panel.classList.add('open');
    panel.addEventListener('transitionend', function handler() {
      panel.style.height = 'auto';
      panel.removeEventListener('transitionend', handler);
    });
  }

  function close(panel) {
    const height = panel.scrollHeight;
    panel.style.height = height + 'px';
    requestAnimationFrame(() => {
      panel.style.height = '0px';
      panel.classList.remove('open');
    });
    panel.addEventListener('transitionend', function handler() {
      panel.hidden = true;
      panel.removeEventListener('transitionend', handler);
    });
  }
}

if (typeof module !== 'undefined') {
  module.exports = { setupAccordion };
}
