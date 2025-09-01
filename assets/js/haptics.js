(function () {
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function vibrate(pattern) {
    if (reduceMotionQuery.matches) return;
    if (typeof navigator.vibrate === 'function' && navigator.maxTouchPoints > 0) {
      navigator.vibrate(pattern);
    }
  }

  function success() {
    vibrate(20);
  }

  function error() {
    vibrate([40, 60, 40]);
  }

  window.haptics = {
    vibrate,
    success,
    error,
  };
})();
