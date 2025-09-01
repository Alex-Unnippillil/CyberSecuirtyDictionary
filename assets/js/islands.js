(function () {
  function loadDictionary() {
    import("./dictionary.js").then((m) => m.initDictionary());
  }

  const termsList = document.getElementById("terms-list");
  if (termsList) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadDictionary();
          obs.disconnect();
        }
      });
    });
    observer.observe(termsList);
  }

  const darkToggle = document.getElementById("dark-mode-toggle");
  if (darkToggle) {
    darkToggle.addEventListener(
      "click",
      () => {
        import("./dark-mode.js").then((m) => m.initDarkMode());
      },
      { once: true }
    );
  }
})();
