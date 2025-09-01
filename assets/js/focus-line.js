(function () {
  const toggle = document.getElementById('focus-line-toggle');
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!toggle || reduceMotionQuery.matches) {
    if (toggle) {
      toggle.style.display = 'none';
    }
    return;
  }

  const line = document.createElement('div');
  line.id = 'focus-line';
  document.body.appendChild(line);

  function isEnabled() {
    return line.classList.contains('visible');
  }

  function updateLine() {
    if (!isEnabled()) return;
    const active = document.activeElement;
    let top;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
      const rect = active.getBoundingClientRect();
      top = rect.top + window.scrollY + rect.height / 2;
    } else {
      const sel = document.getSelection();
      if (sel && sel.rangeCount > 0) {
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        if (rect.top || rect.bottom) {
          top = rect.top + window.scrollY;
        }
      }
    }
    if (top === undefined) {
      top = window.scrollY + window.innerHeight / 2;
    }
    line.style.top = `${top}px`;
  }

  toggle.addEventListener('click', () => {
    line.classList.toggle('visible');
    const visible = isEnabled();
    localStorage.setItem('focusLine', visible);
    if (visible) {
      updateLine();
    }
  });

  if (localStorage.getItem('focusLine') === 'true') {
    line.classList.add('visible');
    updateLine();
  }

  document.addEventListener('selectionchange', updateLine);
  window.addEventListener('scroll', updateLine);
  window.addEventListener('keyup', updateLine);
  window.addEventListener('click', updateLine);

  reduceMotionQuery.addEventListener('change', (e) => {
    if (e.matches) {
      line.classList.remove('visible');
      toggle.style.display = 'none';
    } else {
      toggle.style.display = '';
      if (localStorage.getItem('focusLine') === 'true') {
        line.classList.add('visible');
        updateLine();
      }
    }
  });
})();
