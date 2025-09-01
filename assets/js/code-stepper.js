// Code stepper reveals code lines sequentially with play/pause and keyboard navigation

document.addEventListener("DOMContentLoaded", () => {
  const pre = document.querySelector(".code-stepper");
  if (!pre) return;

  const lines = pre.textContent.trimEnd().split("\n");
  pre.textContent = "";
  lines.forEach((line, idx) => {
    const span = document.createElement("span");
    span.textContent = line;
    span.classList.add("code-line");
    if (idx > 0) span.style.display = "none";
    pre.appendChild(span);
  });

  const playPauseBtn = document.getElementById("play-pause");
  const progress = document.getElementById("line-progress");
  const progressText = document.getElementById("line-progress-text");

  let current = 0;
  let timer = null;

  progress.max = lines.length;
  updateProgress();

  function updateProgress() {
    progress.value = current + 1;
    if (progressText) {
      progressText.textContent = `${current + 1}/${lines.length}`;
    }
  }

  function render() {
    const spans = pre.querySelectorAll(".code-line");
    spans.forEach((span, i) => {
      span.style.display = i <= current ? "block" : "none";
    });
    updateProgress();
  }

  function stepForward() {
    if (current < lines.length - 1) {
      current += 1;
      render();
    } else {
      pause();
    }
  }

  function stepBackward() {
    if (current > 0) {
      current -= 1;
      render();
    }
  }

  function play() {
    if (timer) return;
    playPauseBtn.textContent = "Pause";
    timer = setInterval(stepForward, 1000);
  }

  function pause() {
    playPauseBtn.textContent = "Play";
    clearInterval(timer);
    timer = null;
  }

  playPauseBtn.addEventListener("click", () => {
    if (timer) {
      pause();
    } else {
      play();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
    if (e.code === "ArrowRight") {
      stepForward();
    } else if (e.code === "ArrowLeft") {
      stepBackward();
    } else if (e.code === "Space") {
      e.preventDefault();
      if (timer) {
        pause();
      } else {
        play();
      }
    }
  });
});
