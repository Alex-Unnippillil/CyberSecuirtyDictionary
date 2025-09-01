(function () {
  const canvas = document.getElementById("perf-canvas");
  const readout = document.getElementById("frame-time");
  const supportInfo = document.getElementById("support-info");
  if (!canvas || !readout || !supportInfo) return;

  const supportsOffscreen =
    typeof OffscreenCanvas !== "undefined" && canvas.transferControlToOffscreen;
  supportInfo.textContent = supportsOffscreen
    ? "OffscreenCanvas supported: rendering in worker"
    : "OffscreenCanvas not supported: rendering on main thread";

  if (supportsOffscreen) {
    const offscreen = canvas.transferControlToOffscreen();
    const worker = new Worker("assets/js/canvas-worker.js");
    worker.postMessage({ canvas: offscreen }, [offscreen]);
    worker.onmessage = (e) => {
      if (e.data && e.data.avg) {
        readout.textContent = `Average frame time: ${e.data.avg.toFixed(2)} ms`;
      }
    };
  } else {
    const ctx = canvas.getContext("2d");
    let last = performance.now();
    let times = [];
    function draw() {
      const now = performance.now();
      times.push(now - last);
      last = now;
      if (times.length >= 60) {
        const avg = times.reduce((a, b) => a + b) / times.length;
        readout.textContent = `Average frame time: ${avg.toFixed(2)} ms`;
        times = [];
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 100000; i++) {
        Math.sqrt(i);
      }
      ctx.fillStyle =
        "#" +
        Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, "0");
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        50,
        50,
      );
      requestAnimationFrame(draw);
    }
    draw();
  }
})();
