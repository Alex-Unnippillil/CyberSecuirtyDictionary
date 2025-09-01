(function () {
  const bar = document.createElement('div');
  bar.id = 'progress-bar';
  document.body.prepend(bar);

  let pending = 0;
  let revealTimeout;
  let isVisible = false;

  function resetBar() {
    bar.classList.remove('active', 'finish');
    bar.style.width = '0%';
    bar.style.opacity = '0';
    isVisible = false;
  }

  function start() {
    pending++;
    if (pending === 1) {
      revealTimeout = setTimeout(() => {
        bar.classList.add('active');
        bar.style.opacity = '1';
        isVisible = true;
      }, 100);
    }
  }

  function done() {
    if (pending === 0) return;
    pending--;
    if (pending === 0) {
      clearTimeout(revealTimeout);
      if (isVisible) {
        bar.classList.add('finish');
        const duration = parseFloat(getComputedStyle(bar).transitionDuration) * 1000;
        setTimeout(resetBar, duration);
      } else {
        resetBar();
      }
    }
  }

  window.navigationProgress = { start, done };

  window.addEventListener('hashchange', () => {
    start();
    setTimeout(done, 0);
  });
})();
