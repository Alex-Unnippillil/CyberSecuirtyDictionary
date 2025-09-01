(function () {
  function formatTime(sec) {
    const minutes = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  async function cacheAudio(url) {
    try {
      const cache = await caches.open("audio-cache");
      const cached = await cache.match(url);
      if (!cached) {
        const response = await fetch(url);
        await cache.put(url, response.clone());
      }
    } catch (e) {
      // ignore caching errors
    }
  }

  function setup(container) {
    const src = container.dataset.src;
    if (!src) return;

    const audio = document.createElement("audio");
    audio.src = src;
    container.appendChild(audio);

    const startSlider = document.createElement("input");
    startSlider.type = "range";
    startSlider.min = 0;
    startSlider.value = 0;
    startSlider.step = 0.01;

    const endSlider = document.createElement("input");
    endSlider.type = "range";
    endSlider.min = 0;
    endSlider.step = 0.01;

    const timecodes = document.createElement("div");
    const startLabel = document.createElement("span");
    const endLabel = document.createElement("span");
    timecodes.appendChild(startLabel);
    timecodes.append(" - ");
    timecodes.appendChild(endLabel);

    const playBtn = document.createElement("button");
    playBtn.textContent = "Play";
    const stopBtn = document.createElement("button");
    stopBtn.textContent = "Stop";

    container.appendChild(startSlider);
    container.appendChild(endSlider);
    container.appendChild(timecodes);
    container.appendChild(playBtn);
    container.appendChild(stopBtn);

    audio.addEventListener("loadedmetadata", () => {
      startSlider.max = endSlider.max = audio.duration;
      endSlider.value = audio.duration;
      startLabel.textContent = formatTime(startSlider.value);
      endLabel.textContent = formatTime(endSlider.value);
    });

    startSlider.addEventListener("input", () => {
      if (+startSlider.value >= +endSlider.value) {
        startSlider.value = Math.max(0, +endSlider.value - 0.1);
      }
      startLabel.textContent = formatTime(startSlider.value);
    });

    endSlider.addEventListener("input", () => {
      if (+endSlider.value <= +startSlider.value) {
        endSlider.value = +startSlider.value + 0.1;
      }
      endLabel.textContent = formatTime(endSlider.value);
    });

    playBtn.addEventListener("click", () => {
      audio.currentTime = +startSlider.value;
      audio.play();
    });

    stopBtn.addEventListener("click", () => {
      audio.pause();
      audio.currentTime = +startSlider.value;
    });

    audio.addEventListener("timeupdate", () => {
      if (audio.currentTime >= +endSlider.value) {
        audio.currentTime = +startSlider.value;
      }
    });

    audio.addEventListener(
      "play",
      () => {
        cacheAudio(audio.currentSrc || audio.src);
      },
      { once: true }
    );
  }

  window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".audio-player").forEach(setup);
  });
})();
