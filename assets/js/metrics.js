(function () {
  const KEY = "web-vitals";

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
      setTimeout(() => sendToVercel(sample), 0);
    });
  }

  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("DOMContentLoaded", init);
  }
})();

function sendToVercel(sample) {
  try {
    const id = window.VERCEL_ANALYTICS_ID;
    if (!id || !navigator.sendBeacon) return;
    const body = JSON.stringify({ id, ...sample });
    navigator.sendBeacon("https://vitals.vercel-insights.com/v1/vitals", body);
  } catch (e) {
    // ignore network errors
  }
}
