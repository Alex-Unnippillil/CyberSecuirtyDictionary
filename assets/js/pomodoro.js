// Simple Pomodoro timer with short/long breaks and persistent state
(function () {
  const defaultDurations = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  const state = JSON.parse(localStorage.getItem("pomodoroState") || "{}");

  let mode = state.mode || "work";
  let endTime = state.endTime || null;
  let timerInterval = null;
  let pinned = state.pinned !== false; // default pinned
  let currentItem = state.currentItem || null;

  const container = document.createElement("div");
  container.id = "pomodoro-timer";
  container.innerHTML = `
    <select id="pomodoro-mode">
      <option value="work">Work</option>
      <option value="shortBreak">Short Break</option>
      <option value="longBreak">Long Break</option>
    </select>
    <span id="pomodoro-time"></span>
    <button id="pomodoro-start" type="button">Start</button>
    <button id="pomodoro-reset" type="button">Reset</button>
    <button id="pomodoro-pin" type="button">Pin</button>
    <div id="pomodoro-current"></div>
  `;
  document.body.appendChild(container);

  const modeSelect = container.querySelector("#pomodoro-mode");
  const timeDisplay = container.querySelector("#pomodoro-time");
  const startBtn = container.querySelector("#pomodoro-start");
  const resetBtn = container.querySelector("#pomodoro-reset");
  const pinBtn = container.querySelector("#pomodoro-pin");
  const currentDiv = container.querySelector("#pomodoro-current");

  function persist() {
    localStorage.setItem(
      "pomodoroState",
      JSON.stringify({ mode, endTime, pinned, currentItem }),
    );
  }

  function updateDisplay() {
    if (!endTime) {
      timeDisplay.textContent = formatTime(defaultDurations[mode]);
      return;
    }
    const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    timeDisplay.textContent = formatTime(remaining);
    if (remaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      endTime = null;
      persist();
    }
  }

  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function start() {
    if (!endTime) {
      endTime = Date.now() + defaultDurations[mode] * 1000;
      if (mode === "work" && typeof window.startReadingSession === "function") {
        currentItem = window.startReadingSession();
        currentDiv.textContent = currentItem ? `Reading: ${currentItem}` : "";
      }
      persist();
    }
    if (!timerInterval) {
      timerInterval = setInterval(updateDisplay, 1000);
    }
  }

  function reset() {
    clearInterval(timerInterval);
    timerInterval = null;
    endTime = null;
    currentItem = null;
    currentDiv.textContent = "";
    persist();
    updateDisplay();
  }

  startBtn.addEventListener("click", start);
  resetBtn.addEventListener("click", reset);

  modeSelect.value = mode;
  modeSelect.addEventListener("change", () => {
    mode = modeSelect.value;
    reset();
    persist();
  });

  pinBtn.addEventListener("click", () => {
    pinned = !pinned;
    applyPin();
    persist();
  });

  function applyPin() {
    if (pinned) {
      container.classList.add("pinned");
    } else {
      container.classList.remove("pinned");
    }
  }

  applyPin();
  updateDisplay();
  if (endTime) {
    start();
  }

  currentDiv.textContent = currentItem ? `Reading: ${currentItem}` : "";
})();
