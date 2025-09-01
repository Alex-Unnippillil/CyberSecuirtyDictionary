/**
 * Collects performance metrics and samples FPS during active sessions.
 * Metrics are persisted to localStorage and periodically sent to a
 * telemetry endpoint with no identifying information.
 */
(function () {
  const KEY = "web-vitals";
  const FPS_KEY = "fps-metrics";
  const TELEMETRY_URL = "https://example.com/telemetry";

  let fpsBuffer = [];
  let frameCount = 0;
  let lastFrame = performance.now();

  function storeSample(sample) {
    try {
      const samples = JSON.parse(localStorage.getItem(KEY) || "[]");
      samples.push(sample);
      while (samples.length > 20) samples.shift();
      localStorage.setItem(KEY, JSON.stringify(samples));
    } catch (e) {
      // ignore storage errors
    }
  }

  function storeFpsSample(sample) {
    try {
      const samples = JSON.parse(localStorage.getItem(FPS_KEY) || "[]");
      samples.push(sample);
      while (samples.length > 50) samples.shift();
      localStorage.setItem(FPS_KEY, JSON.stringify(samples));
    } catch (e) {
      // ignore storage errors
    }
  }

  function sendTelemetry() {
    if (!fpsBuffer.length) return;
    const payload = { samples: fpsBuffer.slice() };
    fpsBuffer = [];
    try {
      const body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(TELEMETRY_URL, body);
      } else {
        fetch(TELEMETRY_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        });
      }
    } catch (e) {
      // ignore network errors
    }
  }

  function sampleFps(now) {
    frameCount++;
    const diff = now - lastFrame;
    if (diff >= 1000) {
      const fps = Math.round((frameCount * 1000) / diff);
      const sample = { timestamp: Date.now(), route: location.pathname, fps };
      storeFpsSample(sample);
      fpsBuffer.push(sample);
      frameCount = 0;
      lastFrame = now;
    }
    if (!document.hidden) {
      requestAnimationFrame(sampleFps);
    }
  }

  function startSampler() {
    lastFrame = performance.now();
    frameCount = 0;
    requestAnimationFrame(sampleFps);
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) startSampler();
  });

  setInterval(sendTelemetry, 30000);
  window.addEventListener("beforeunload", sendTelemetry);

  function init() {
    if (!window.webVitals) return;
    const sample = { timestamp: Date.now(), lcp: 0, cls: 0, tbt: 0 };

    webVitals.onLCP(({ value }) => {
      sample.lcp = value;
    });

    webVitals.onCLS(({ value }) => {
      sample.cls = value;
    });

    window.addEventListener("load", () => {
      const tasks = performance.getEntriesByType("longtask");
      sample.tbt = tasks.reduce(
        (sum, task) => sum + Math.max(0, task.duration - 50),
        0,
      );
      setTimeout(() => storeSample(sample), 0);
    });

    startSampler();
  }

  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("DOMContentLoaded", init);
  }
})();
