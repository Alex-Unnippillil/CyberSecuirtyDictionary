(function () {
  const dock = document.getElementById("dock");
  const toggle = document.getElementById("dock-toggle");
  const resizer = document.getElementById("dock-resizer");
  if (!dock || !toggle || !resizer) return;

  const root = document.documentElement;
  const savedWidth = parseInt(localStorage.getItem("dockWidth"), 10);
  const savedOpen = localStorage.getItem("dockOpen");

  if (!isNaN(savedWidth)) {
    root.style.setProperty("--dock-width", savedWidth + "px");
  }
  const isOpen = savedOpen === "true";
  dock.classList.toggle("open", isOpen);
  document.body.classList.toggle("dock-open", isOpen);

  toggle.addEventListener("click", () => {
    const open = dock.classList.toggle("open");
    document.body.classList.toggle("dock-open", open);
    localStorage.setItem("dockOpen", open);
  });

  resizer.addEventListener("pointerdown", (e) => {
    const startX = e.clientX;
    const startWidth = dock.getBoundingClientRect().width;

    function onMove(ev) {
      const newWidth = Math.max(150, startWidth + (ev.clientX - startX));
      root.style.setProperty("--dock-width", newWidth + "px");
    }

    function onUp() {
      const width = parseInt(getComputedStyle(dock).width, 10);
      localStorage.setItem("dockWidth", width);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    }

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  });
})();
