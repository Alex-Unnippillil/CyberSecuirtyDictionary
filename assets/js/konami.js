const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

function setupKonamiCode(callback) {
  let position = 0;
  return function (event) {
    const key = event.key;
    if (key.toLowerCase() === KONAMI_SEQUENCE[position].toLowerCase()) {
      position++;
      if (position === KONAMI_SEQUENCE.length) {
        callback();
        position = 0;
      }
    } else {
      position = key === KONAMI_SEQUENCE[0] ? 1 : 0;
    }
  };
}

if (typeof document !== "undefined") {
  // Konami code easter egg. Remove this block to disable.
  const commands = [
    "ls -la",
    "pwd",
    "whoami",
    'echo "Stay secure!"',
    "nmap -sS localhost",
    "ping example.com",
    "netstat -an",
  ];
  let terminalVisible = false;
  let intervalId;
  const handler = setupKonamiCode(() => {
    terminalVisible = !terminalVisible;
    if (terminalVisible) {
      showTerminal();
    } else {
      hideTerminal();
    }
  });
  document.addEventListener("keydown", handler);

  function showTerminal() {
    let terminal = document.getElementById("konami-terminal");
    if (!terminal) {
      terminal = document.createElement("div");
      terminal.id = "konami-terminal";
      terminal.className = "konami-terminal hidden";
      document.body.appendChild(terminal);
    }
    terminal.classList.remove("hidden");
    intervalId = setInterval(() => {
      const cmd = commands[Math.floor(Math.random() * commands.length)];
      const line = document.createElement("div");
      line.textContent = `$ ${cmd}`;
      terminal.appendChild(line);
      terminal.scrollTop = terminal.scrollHeight;
    }, 1000);
  }

  function hideTerminal() {
    const terminal = document.getElementById("konami-terminal");
    if (terminal) {
      terminal.classList.add("hidden");
      terminal.innerHTML = "";
    }
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
}

if (typeof module !== "undefined") {
  module.exports = { setupKonamiCode };
}
