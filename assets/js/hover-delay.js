(function (global) {
  function addHoverDelay(el, onEnter, onLeave, delay = 80) {
    let timer;
    let active = false;
    function handleEnter(e) {
      timer = setTimeout(() => {
        active = true;
        if (onEnter) onEnter(e);
      }, delay);
    }
    function handleLeave(e) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (active) {
        active = false;
        if (onLeave) onLeave(e);
      }
    }
    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { addHoverDelay };
  }
  global.addHoverDelay = addHoverDelay;
})(typeof window !== "undefined" ? window : globalThis);
