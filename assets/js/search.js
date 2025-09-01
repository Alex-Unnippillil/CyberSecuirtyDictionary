(function () {
  const resultsContainer = document.getElementById("results");
  const searchInput = document.getElementById("search-box");
  let miniSearch;

  document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = window.__BASE_URL__ || "";
    fetch(`${baseUrl}/terms.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((data) => {
        const terms = Array.isArray(data) ? data : data.terms || [];
        miniSearch = new MiniSearch({
          fields: ["title", "definition", "category", "synonyms"],
          storeFields: ["title", "definition", "category", "synonyms"],
          searchOptions: {
            prefix: true,
            fuzzy: 0.2,
            boost: { title: 2 },
          },
        });

        const docs = terms.map((t, i) => ({
          id: i,
          title: t.name || t.term || "",
          definition: t.definition || "",
          category: t.category || "",
          synonyms: t.synonyms || [],
        }));

        miniSearch.addAll(docs);
      })
      .catch((err) => {
        console.error("Failed to load terms.json", err);
      });

    searchInput.addEventListener("input", handleSearch);
  });

  function handleSearch() {
    const query = searchInput.value.trim();
    resultsContainer.innerHTML = "";
    if (!query || !miniSearch) {
      return;
    }
    const matches = miniSearch.search(query);
    matches.forEach((result) => {
      resultsContainer.appendChild(renderCard(result));
    });
  }

  function renderCard(term) {
    const card = document.createElement("div");
    card.className = "result-card";

    const title = document.createElement("h3");
    title.textContent = term.title || "";
    card.appendChild(title);

    if (term.category) {
      const cat = document.createElement("p");
      cat.className = "category";
      cat.textContent = term.category;
      card.appendChild(cat);
    }

    const def = document.createElement("p");
    def.textContent = term.definition || "";
    card.appendChild(def);

    if (term.synonyms && term.synonyms.length) {
      const syn = document.createElement("p");
      syn.className = "synonyms";
      syn.textContent = `Synonyms: ${term.synonyms.join(", ")}`;
      card.appendChild(syn);
    }
    return card;
  }
})();
