(function (global) {
  function attachWillChange(element, property) {
    if (!element) return;

    const set = () => {
      element.style.willChange = property || 'auto';
    };

    const clear = () => {
      element.style.removeProperty('will-change');
      // verify removal so no lingering will-change remains
      const computed = element.ownerDocument.defaultView.getComputedStyle(element).willChange;
      if (computed && computed !== 'auto' && computed !== '') {
        console.warn('will-change not removed from element', element);
      }
    };

    element.addEventListener('transitionstart', set);
    element.addEventListener('transitionend', clear);
    element.addEventListener('animationstart', set);
    element.addEventListener('animationend', clear);

    return { set, clear };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { attachWillChange };
  } else {
    global.attachWillChange = attachWillChange;
  }
})(typeof window !== 'undefined' ? window : globalThis);

