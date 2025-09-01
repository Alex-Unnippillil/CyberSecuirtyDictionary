(function () {
  const btn = document.getElementById("scrollToTopBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  let ticking = false;
  function update() {
    const show = window.scrollY > 200;
    btn.classList.toggle("show", show);
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  });
})();
