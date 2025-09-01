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
    initKeyboard();
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

  function initKeyboard() {
    const toggleBtn = document.getElementById("toggle-keyboard");
    const keyboard = document.getElementById("special-keyboard");
    if (!toggleBtn || !keyboard) return;

    const chars = [
      "á",
      "é",
      "í",
      "ó",
      "ú",
      "ñ",
      "ü",
      "ß",
      "ø",
      "å",
      "æ",
      "œ",
      "ç",
      "Ω",
      "π",
    ];
    chars.forEach((ch) => {
      const key = document.createElement("button");
      key.type = "button";
      key.textContent = ch;
      key.dataset.char = ch;
      key.setAttribute("aria-label", `Insert ${ch}`);
      keyboard.appendChild(key);
    });

    toggleBtn.addEventListener("click", () => {
      const hidden = keyboard.hasAttribute("hidden");
      if (hidden) {
        keyboard.removeAttribute("hidden");
        toggleBtn.setAttribute("aria-expanded", "true");
      } else {
        keyboard.setAttribute("hidden", "");
        toggleBtn.setAttribute("aria-expanded", "false");
      }
      searchInput.focus();
    });

    keyboard.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.dataset && t.dataset.char) {
        insertChar(t.dataset.char);
      }
    });

    keyboard.addEventListener("keydown", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      const buttons = Array.from(keyboard.querySelectorAll("button"));
      const index = buttons.indexOf(t);
      const cols = 8;
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          buttons[(index + 1) % buttons.length].focus();
          break;
        case "ArrowLeft":
          e.preventDefault();
          buttons[(index - 1 + buttons.length) % buttons.length].focus();
          break;
        case "ArrowDown":
          e.preventDefault();
          buttons[(index + cols) % buttons.length].focus();
          break;
        case "ArrowUp":
          e.preventDefault();
          buttons[(index - cols + buttons.length) % buttons.length].focus();
          break;
        case "Enter":
        case " ": // space
          e.preventDefault();
          if (t.dataset.char) {
            insertChar(t.dataset.char);
          }
          break;
      }
    });

    function insertChar(ch) {
      const start = searchInput.selectionStart;
      const end = searchInput.selectionEnd;
      searchInput.setRangeText(ch, start, end, "end");
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
      searchInput.focus();
    }
  }
})();
