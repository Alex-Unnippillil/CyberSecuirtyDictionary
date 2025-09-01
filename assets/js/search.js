(function () {
  const resultsContainer = document.getElementById("results");
  const searchInput = document.getElementById("search-box");
  const micButton = document.getElementById("mic-button");
  const speechTranscript = document.getElementById("speech-transcript");
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

    if (micButton && speechTranscript) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        speechTranscript.textContent = "Speech recognition not supported.";
      } else {
        const recognition = new SpeechRecognition();
        recognition.interimResults = true;
        recognition.lang = "en-US";
        let finalTranscript = "";

        micButton.addEventListener("click", () => {
          finalTranscript = "";
          speechTranscript.textContent = "";
          recognition.start();
        });

        recognition.addEventListener("result", (event) => {
          finalTranscript = Array.from(event.results)
            .map((r) => r[0].transcript)
            .join("");
          speechTranscript.textContent = finalTranscript;
        });

        recognition.addEventListener("error", (event) => {
          speechTranscript.textContent = `Speech recognition error: ${event.error}`;
        });

        recognition.addEventListener("end", () => {
          if (finalTranscript) {
            searchInput.value = finalTranscript;
            handleSearch();
          }
        });
      }
    }
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
