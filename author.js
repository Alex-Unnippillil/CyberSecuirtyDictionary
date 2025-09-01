const dashboard = document.getElementById("author-dashboard");
const queueList = document.getElementById("queue-list");
const errorList = document.getElementById("error-list");

function hasAccess() {
  return localStorage.getItem("role") === "author";
}

if (!hasAccess()) {
  dashboard.innerHTML = "<p>Access denied. Author role required.</p>";
} else {
  initDashboard();
}

function initDashboard() {
  fetch("terms.json")
    .then((response) => response.json())
    .then((data) => {
      const existingTerms = data.terms.map((t) => t.term.toLowerCase());
      const pending = JSON.parse(localStorage.getItem("pendingTerms") || "[]");

      if (pending.length === 0) {
        queueList.innerHTML = "<li>No items in review queue.</li>";
        return;
      }

      pending.forEach((item, idx) => {
        const li = document.createElement("li");
        li.textContent = item.term;
        queueList.appendChild(li);

        if (existingTerms.includes(item.term.toLowerCase())) {
          const errItem = document.createElement("li");
          errItem.innerHTML = `Duplicate term: ${item.term} <button data-index="${idx}" class="merge-btn">Merge</button>`;
          errorList.appendChild(errItem);
        }
        if (!item.definition) {
          const errItem = document.createElement("li");
          errItem.textContent = `Missing definition for ${item.term}`;
          errorList.appendChild(errItem);
        }
      });

      document.querySelectorAll(".merge-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const index = Number(e.target.dataset.index);
          mergeTerm(pending[index], data);
          pending.splice(index, 1);
          localStorage.setItem("pendingTerms", JSON.stringify(pending));
          window.location.reload();
        });
      });
    })
    .catch((err) => {
      errorList.innerHTML = `<li>Failed to load terms: ${err.message}</li>`;
    });
}

function mergeTerm(pendingTerm, termsData) {
  const existing = termsData.terms.find(
    (t) => t.term.toLowerCase() === pendingTerm.term.toLowerCase(),
  );
  if (existing) {
    const synonyms = new Set([
      ...(existing.synonyms || []),
      ...(pendingTerm.synonyms || []),
    ]);
    existing.synonyms = Array.from(synonyms);
  }
}
