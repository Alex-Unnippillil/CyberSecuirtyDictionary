(function () {
  const resultsContainer = document.getElementById("results");
  const searchInput = document.getElementById("search-box");
  let terms = [];

  document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = window.__BASE_URL__ || "";
    fetch(`${baseUrl}/terms.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((data) => {
        // terms.json may either be an array or object with terms property
        terms = Array.isArray(data) ? data : data.terms || [];
      })
      .catch((err) => {
        console.error("Failed to load terms.json", err);
      });

    searchInput.addEventListener("input", handleSearch);
  });

  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    resultsContainer.innerHTML = "";
    if (!query) {
      return;
    }
    const matches = terms
      .map((term) => ({ term, score: score(term, query) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    matches.forEach(({ term }) => {
      resultsContainer.appendChild(renderCard(term));
    });
  }

  function score(term, query) {
    let s = 0;
    const name = (term.name || term.term || "").toLowerCase();
    const def = (term.definition || "").toLowerCase();
    const category = (term.category || "").toLowerCase();
    const syns = (term.synonyms || []).map((s) => s.toLowerCase());
    if (name.includes(query)) s += 3;
    if (def.includes(query)) s += 1;
    if (category.includes(query)) s += 1;
    if (syns.some((syn) => syn.includes(query))) s += 2;
    return s;
  }

  function renderCard(term) {
    const card = document.createElement("div");
    card.className = "result-card";

    const title = document.createElement("h3");
    title.textContent = term.name || term.term || "";
    card.appendChild(title);

    if (term.category) {
      const cat = document.createElement("p");
      cat.className = "category";
      cat.textContent = term.category;
      card.appendChild(cat);
    }

    const def = document.createElement("p");
    if (term.definition) {
      const defPositions = (term.positions && term.positions.definition) || [];
      if (defPositions.length) {
        def.innerHTML = highlightText(term.definition, defPositions);
      } else {
        def.textContent = term.definition;
      }
    }
    card.appendChild(def);

    if (Array.isArray(term.examples) && term.examples.length) {
      term.examples.forEach((example, idx) => {
        const exP = document.createElement("p");
        exP.className = "example";
        const exPositions =
          (term.positions &&
            term.positions.examples &&
            term.positions.examples[idx]) ||
          [];
        if (exPositions.length) {
          exP.innerHTML = highlightText(example, exPositions);
        } else {
          exP.textContent = example;
        }
        card.appendChild(exP);
      });
    }

    if (term.synonyms && term.synonyms.length) {
      const syn = document.createElement("p");
      syn.className = "synonyms";
      syn.textContent = `Synonyms: ${term.synonyms.join(", ")}`;
      card.appendChild(syn);
    }
    return card;
  }

  function highlightText(text, positions) {
    if (!Array.isArray(positions) || positions.length === 0) {
      return escapeHTML(text || "");
    }

    positions.sort((a, b) => a[0] - b[0]);
    let lastIndex = 0;
    let result = "";
    positions.forEach(([start, end]) => {
      result += escapeHTML(text.slice(lastIndex, start));
      result += "<mark>" + escapeHTML(text.slice(start, end)) + "</mark>";
      lastIndex = end;
    });
    result += escapeHTML(text.slice(lastIndex));
    return result;
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();
