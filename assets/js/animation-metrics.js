(function () {
  const KEY = "animation-metrics";

  function store(name, status) {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (!data[name]) data[name] = { completed: 0, dropped: 0 };
      if (status === "completed") data[name].completed++;
      if (status === "dropped") data[name].dropped++;
      localStorage.setItem(KEY, JSON.stringify(data));
      evaluate(name, data[name]);
    } catch (e) {
      // ignore storage errors
    }
  }

  function evaluate(name, stats) {
    const total = stats.completed + stats.dropped;
    if (total >= 5 && stats.completed / total < 0.5) {
      console.warn(
        `${name} animation underperforming; consider refining or removing.`,
      );
    }
  }

  function trackScrollToTop() {
    let completed = false;
    function onScroll() {
      if (window.scrollY === 0) {
        completed = true;
        store("scrollToTop", "completed");
        window.removeEventListener("scroll", onScroll);
      }
    }
    window.addEventListener("scroll", onScroll);
    setTimeout(() => {
      window.removeEventListener("scroll", onScroll);
      if (!completed) {
        store("scrollToTop", "dropped");
      }
    }, 1000);
  }

  window.addEventListener("scrollToTopTriggered", trackScrollToTop);

  window.animationMetrics = { store, trackScrollToTop };
})();
