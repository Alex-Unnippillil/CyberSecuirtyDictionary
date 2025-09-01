(function () {
  const leftEl = document.getElementById("headword-left");
  const rightEl = document.getElementById("headword-right");

  function parseSlugs() {
    const segments = window.location.pathname.split("/").filter(Boolean);
    let slugA = null;
    let slugB = null;
    const compareIndex = segments.indexOf("compare");
    if (compareIndex !== -1) {
      slugA = segments[compareIndex + 1] || null;
      slugB = segments[compareIndex + 2] || null;
    }
    const params = new URLSearchParams(window.location.search);
    if (!slugA) slugA = params.get("a");
    if (!slugB) slugB = params.get("b");
    return [slugA, slugB];
  }

  function createHeadwordLayout(term) {
    const wrapper = document.createElement("div");
    wrapper.className = "headword-layout";
    if (!term) {
      wrapper.innerHTML = "<p>Term not found.</p>";
      return wrapper;
    }
    const h2 = document.createElement("h2");
    h2.textContent = term.term;
    const p = document.createElement("p");
    p.textContent = term.definition;
    wrapper.appendChild(h2);
    wrapper.appendChild(p);
    return wrapper;
  }

  function loadTerms(slugA, slugB) {
    fetch("terms.json")
      .then((res) => res.json())
      .then((data) => {
        const termA = data.terms.find(
          (t) => t.term.toLowerCase() === decodeURIComponent(slugA || "").toLowerCase()
        );
        const termB = data.terms.find(
          (t) => t.term.toLowerCase() === decodeURIComponent(slugB || "").toLowerCase()
        );
        leftEl.appendChild(createHeadwordLayout(termA));
        rightEl.appendChild(createHeadwordLayout(termB));
        setupSync();
      })
      .catch(() => {
        leftEl.textContent = "Error loading terms.";
        rightEl.textContent = "Error loading terms.";
      });
  }

  function setupSync() {
    let leftSyncing = false;
    let rightSyncing = false;
    leftEl.addEventListener("scroll", () => {
      if (!leftSyncing) {
        rightSyncing = true;
        rightEl.scrollTop = leftEl.scrollTop;
      }
      leftSyncing = false;
    });
    rightEl.addEventListener("scroll", () => {
      if (!rightSyncing) {
        leftSyncing = true;
        leftEl.scrollTop = rightEl.scrollTop;
      }
      rightSyncing = false;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const [a, b] = parseSlugs();
    loadTerms(a, b);
  });
})();
