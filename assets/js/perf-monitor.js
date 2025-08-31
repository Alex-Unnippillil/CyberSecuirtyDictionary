(function(){
  if (!("PerformanceObserver" in window)) {
    return;
  }
  let tbt = 0;
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const blocking = entry.duration - 50;
      if (blocking > 0) {
        tbt += blocking;
      }
    }
  });
  observer.observe({ type: "longtask", buffered: true });

  function report() {
    try {
      navigator.sendBeacon("/analytics", JSON.stringify({ tbt }));
    } catch (e) {
      console.log("TBT", tbt);
    }
  }

  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      report();
    }
  });
})();
