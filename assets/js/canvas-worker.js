self.onmessage = (e) => {
  const canvas = e.data.canvas;
  const ctx = canvas.getContext("2d");
  let last = performance.now();
  let times = [];

  function draw() {
    const now = performance.now();
    times.push(now - last);
    last = now;
    if (times.length >= 60) {
      const avg = times.reduce((a, b) => a + b) / times.length;
      self.postMessage({ avg });
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
    if (self.requestAnimationFrame) {
      self.requestAnimationFrame(draw);
    } else {
      setTimeout(draw, 16);
    }
  }
  draw();
};
