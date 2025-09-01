(function () {
  let hovercard;
  let showTimer;

  function ensureCard() {
    if (hovercard) return;
    hovercard = document.createElement('div');
    hovercard.id = 'hovercard';
    hovercard.className = 'hovercard';
    hovercard.setAttribute('role', 'tooltip');
    document.body.appendChild(hovercard);
  }

  function show(target) {
    ensureCard();
    clearTimeout(showTimer);
    showTimer = setTimeout(() => {
      const text = target.getAttribute('data-hovercard');
      if (!text) return;
      hovercard.textContent = text;
      const rect = target.getBoundingClientRect();
      hovercard.style.top = `${rect.bottom + window.scrollY}px`;
      hovercard.style.left = `${rect.left + window.scrollX}px`;
      hovercard.classList.add('visible');
      target.setAttribute('aria-describedby', 'hovercard');
    }, 50); // <100ms appearance
  }

  function hide() {
    clearTimeout(showTimer);
    if (hovercard) {
      hovercard.classList.remove('visible');
    }
  }

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-hovercard]');
    if (!target) return;
    show(target);
  });

  document.addEventListener('focusin', (e) => {
    const target = e.target.closest('[data-hovercard]');
    if (!target) return;
    show(target);
  });

  document.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget || !e.relatedTarget.closest('[data-hovercard]')) {
      hide();
    }
  });

  document.addEventListener('focusout', hide);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hide();
      if (document.activeElement) {
        document.activeElement.blur();
      }
    }
  });
})();
