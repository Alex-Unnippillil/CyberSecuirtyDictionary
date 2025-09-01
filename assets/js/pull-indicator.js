(() => {
  const supportsTouch = 'ontouchstart' in window && navigator.maxTouchPoints > 0;
  if (!supportsTouch) {
    return; // Only enable on touch devices
  }

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReduced = reduceMotionQuery.matches;

  const indicator = document.createElement('div');
  indicator.id = 'pull-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  document.body.prepend(indicator);

  let startY = 0;
  let active = false;

  function onTouchStart(e) {
    if (window.scrollY === 0) {
      startY = e.touches[0].clientY;
      active = true;
      if (!prefersReduced) {
        indicator.style.transition = 'none';
      }
    }
  }

  function onTouchMove(e) {
    if (!active) return;
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY);
    const stretch = Math.min(distance / 100, 1);
    indicator.style.transform = `scaleY(${stretch})`;
  }

  function onTouchEnd() {
    if (!active) return;
    active = false;
    if (!prefersReduced) {
      indicator.style.transition = 'transform 0.2s ease';
    }
    indicator.style.transform = 'scaleY(0)';
  }

  document.addEventListener('touchstart', onTouchStart, { passive: true });
  document.addEventListener('touchmove', onTouchMove, { passive: true });
  document.addEventListener('touchend', onTouchEnd);

  const handleMotionChange = (e) => {
    if (e.matches) {
      indicator.style.transition = 'none';
    }
  };
  if (reduceMotionQuery.addEventListener) {
    reduceMotionQuery.addEventListener('change', handleMotionChange);
  } else if (reduceMotionQuery.addListener) {
    reduceMotionQuery.addListener(handleMotionChange);
  }
})();
