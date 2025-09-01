(function () {
  function renderCollocations(collocations) {
    const container = document.getElementById("collocation-chips");
    if (!container) return;
    collocations.forEach((item) => {
      const chip = document.createElement("button");
      chip.className = "collocation-chip";
      chip.type = "button";
      const label = document.createElement("span");
      label.textContent = item.pattern || "";
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = item.count || 0;
      chip.appendChild(label);
      chip.appendChild(badge);
      chip.addEventListener("click", () => showExamples(item));
      container.appendChild(chip);
    });
  }

  function showExamples(item) {
    const modal = document.getElementById("examples-modal");
    const list = document.getElementById("examples-list");
    if (!modal || !list) return;
    list.innerHTML = "";
    (item.examples || []).forEach((ex) => {
      const li = document.createElement("li");
      li.textContent = ex;
      list.appendChild(li);
    });
    modal.style.display = "block";
  }

  document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("examples-modal");
    const closeBtn = modal ? modal.querySelector(".close") : null;
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });

    fetch("/api/collocations")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((data) => renderCollocations(data))
      .catch((err) => console.error("Failed to load collocations", err));
  });
})();
