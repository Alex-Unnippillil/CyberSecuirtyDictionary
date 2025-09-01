// Components and search logic for the CyberSecurity Dictionary search page
// Implements a debounced SearchBar with Cmd/Ctrl+K shortcut, TermCard
// listings, PromptChips for quick queries, an ExpandPane drawer for
// displaying selected results, a SettingsSheet modal and an EmptyState
// component for when no results are available.

class SearchBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.placeholder = this.getAttribute("placeholder") || "Search";
    this.shadowRoot.appendChild(this.input);

    this.delay = parseInt(this.getAttribute("debounce"), 10) || 300;
    this.timer = null;

    this.input.addEventListener("input", () => {
      clearTimeout(this.timer);
      const value = this.input.value;
      this.timer = setTimeout(() => {
        this.dispatchEvent(
          new CustomEvent("search", { detail: value, bubbles: true })
        );
      }, this.delay);
    });

    document.addEventListener("keydown", (e) => {
      if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.focus();
      }
    });
  }

  focus() {
    this.input.focus();
    this.input.select();
  }

  set value(v) {
    this.input.value = v;
  }

  get value() {
    return this.input.value;
  }

  triggerSearch() {
    this.dispatchEvent(
      new CustomEvent("search", { detail: this.value, bubbles: true })
    );
  }
}

class TermCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const wrapper = document.createElement("div");
    wrapper.className = "term-card";
    const title = document.createElement("h3");
    title.className = "term-title";
    const def = document.createElement("p");
    def.className = "term-definition";
    wrapper.appendChild(title);
    wrapper.appendChild(def);
    this.shadowRoot.appendChild(wrapper);

    wrapper.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("select", { detail: this.data, bubbles: true })
      );
    });
  }

  set termData(data) {
    this.data = data;
    this.shadowRoot.querySelector(".term-title").textContent =
      data.name || data.term || "";
    this.shadowRoot.querySelector(".term-definition").textContent =
      data.definition || "";
  }
}

class PromptChips extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.container = document.createElement("div");
    this.container.className = "chips";
    this.shadowRoot.appendChild(this.container);
  }

  set prompts(list) {
    this.container.innerHTML = "";
    list.forEach((p) => {
      const chip = document.createElement("button");
      chip.className = "chip";
      chip.type = "button";
      chip.textContent = p;
      chip.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("chip-select", { detail: p, bubbles: true })
        );
      });
      this.container.appendChild(chip);
    });
  }
}

class ExpandPane extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const wrapper = document.createElement("div");
    wrapper.className = "pane";
    wrapper.innerHTML = `
      <button class="close" type="button">&times;</button>
      <div class="body">
        <div class="spinner" hidden></div>
        <div class="result"></div>
        <button class="copy" type="button" hidden>Copy</button>
      </div>`;
    this.shadowRoot.appendChild(wrapper);

    this.spinner = wrapper.querySelector(".spinner");
    this.result = wrapper.querySelector(".result");
    this.copyBtn = wrapper.querySelector(".copy");

    wrapper.querySelector(".close").addEventListener("click", () =>
      this.close()
    );
    this.copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(this.result.textContent || "");
    });
  }

  open() {
    this.setAttribute("open", "");
  }

  close() {
    this.removeAttribute("open");
  }

  loading() {
    this.spinner.hidden = false;
    this.result.textContent = "";
    this.copyBtn.hidden = true;
  }

  setResult(text) {
    this.spinner.hidden = true;
    this.result.textContent = text;
    this.copyBtn.hidden = false;
  }
}

class SettingsSheet extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const wrapper = document.createElement("div");
    wrapper.className = "sheet";
    wrapper.innerHTML = `
      <div class="sheet-content"><slot></slot></div>
      <button class="close" type="button">Close</button>`;
    this.shadowRoot.appendChild(wrapper);

    wrapper.querySelector(".close").addEventListener("click", () =>
      this.close()
    );
  }

  open() {
    this.setAttribute("open", "");
  }

  close() {
    this.removeAttribute("open");
  }
}

class EmptyState extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const msg = document.createElement("p");
    msg.className = "empty-message";
    this.shadowRoot.appendChild(msg);
    this.hide();
  }

  show(message) {
    this.shadowRoot.querySelector(".empty-message").textContent = message;
    this.style.display = "block";
  }

  hide() {
    this.style.display = "none";
  }
}

customElements.define("search-bar", SearchBar);
customElements.define("term-card", TermCard);
customElements.define("prompt-chips", PromptChips);
customElements.define("expand-pane", ExpandPane);
customElements.define("settings-sheet", SettingsSheet);
customElements.define("empty-state", EmptyState);

document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.querySelector("search-bar");
  const resultsContainer = document.getElementById("results");
  const chips = document.querySelector("prompt-chips");
  const pane = document.querySelector("expand-pane");
  const empty = document.querySelector("empty-state");
  const settings = document.querySelector("settings-sheet");
  const openSettings = document.getElementById("open-settings");

  let terms = [];

  const baseUrl = window.__BASE_URL__ || "";
  fetch(`${baseUrl}/terms.json`)
    .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
    .then((data) => {
      terms = Array.isArray(data) ? data : data.terms || [];
    })
    .catch((err) => {
      console.error("Failed to load terms.json", err);
    });

  searchBar.addEventListener("search", (e) => {
    const query = e.detail.trim().toLowerCase();
    resultsContainer.innerHTML = "";
    if (!query) {
      empty.show("Start typing to search terms");
      return;
    }
    const matches = terms
      .map((term) => ({ term, score: score(term, query) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    if (matches.length === 0) {
      empty.show("No results found");
      return;
    }

    empty.hide();
    matches.forEach(({ term }) => {
      const card = document.createElement("term-card");
      card.termData = term;
      card.addEventListener("select", () => {
        pane.open();
        pane.loading();
        // Simulate async loading
        setTimeout(() => {
          pane.setResult(term.definition || "");
        }, 200);
      });
      resultsContainer.appendChild(card);
    });
  });

  chips.prompts = ["Network", "Encryption", "Malware"];
  chips.addEventListener("chip-select", (e) => {
    searchBar.value = e.detail;
    searchBar.triggerSearch();
  });

  if (openSettings && settings) {
    openSettings.addEventListener("click", () => settings.open());
  }
});

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

