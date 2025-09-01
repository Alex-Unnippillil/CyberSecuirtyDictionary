(function () {
  const audioCache = new Map();
  const waveformCache = new Map();

  function preload(el) {
    const audioSrc = el.dataset.audioSrc;
    const waveformSrc = el.dataset.waveformSrc;

    if (audioSrc && !audioCache.has(audioSrc)) {
      const audio = new Audio();
      audio.preload = "auto";
      audio.src = audioSrc;
      audioCache.set(audioSrc, audio);
    }

    if (waveformSrc && !waveformCache.has(waveformSrc)) {
      fetch(waveformSrc)
        .then((res) => res.json())
        .then((data) => waveformCache.set(waveformSrc, data))
        .catch(() => {});
    }
  }

  function attach(el) {
    const handler = () => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => preload(el));
      } else {
        setTimeout(() => preload(el), 0);
      }
    };

    el.addEventListener("mouseenter", handler, { once: true });
    el.addEventListener("focus", handler, { once: true });

    const play = () => {
      const audio = audioCache.get(el.dataset.audioSrc);
      if (audio) {
        audio.currentTime = 0;
        audio.play();
      }
    };

    el.addEventListener("click", play);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        play();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-audio-src]").forEach(attach);
  });
})();
