const termsList = document.getElementById("terms-list");
const definitionContainer = document.getElementById("definition-container");
const searchInput = document.getElementById("search");
const randomButton = document.getElementById("random-term");
const alphaNav = document.getElementById("alpha-nav");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const showFavoritesToggle = document.getElementById("show-favorites");
const resetOrderBtn = document.getElementById("reset-order");
const resetSettingsBtn = document.getElementById("reset-settings");
const snackbar = document.getElementById("snackbar");
const favorites = new Set(
  JSON.parse(localStorage.getItem("favorites") || "[]"),
);
const siteUrl = "https://alex-unnippillil.github.io/CyberSecuirtyDictionary/";
const canonicalLink = document.getElementById("canonical-link");

// --- Search token overlay and help popover setup ---
const searchWrapper = document.createElement("div");
searchWrapper.id = "search-wrapper";
searchWrapper.style.position = "relative";
searchInput.parentNode.insertBefore(searchWrapper, searchInput);
searchWrapper.appendChild(searchInput);

const tokenOverlay = document.createElement("div");
tokenOverlay.id = "search-token-overlay";
tokenOverlay.style.pointerEvents = "none";
tokenOverlay.style.position = "absolute";
tokenOverlay.style.top = "0";
tokenOverlay.style.left = "0";
tokenOverlay.style.whiteSpace = "pre";
tokenOverlay.style.overflow = "hidden";
tokenOverlay.style.zIndex = "1";
searchWrapper.appendChild(tokenOverlay);

// copy font and padding to overlay so text lines up
const inputStyle = window.getComputedStyle(searchInput);
["font", "padding", "border", "boxSizing", "lineHeight", "height"].forEach(
  (prop) => {
    tokenOverlay.style[prop] = inputStyle[prop];
  },
);
searchInput.style.background = "transparent";
searchInput.style.color = "transparent";
searchInput.style.caretColor = inputStyle.color;
searchInput.style.position = "relative";
searchInput.style.zIndex = "2";

const helpPopover = document.createElement("div");
helpPopover.id = "search-help";
helpPopover.textContent = "Example: phishing AND malware";
helpPopover.style.display = "none";
document.body.appendChild(helpPopover);

function escapeHtml(str) {
  return str.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
}

function tokenize(value) {
  const regex = /(AND|OR|NOT)|\(|\)|[^\s()]+|\s+/gi;
  const tokens = [];
  let match;
  while ((match = regex.exec(value)) !== null) {
    const val = match[0];
    if (/^\s+$/.test(val)) {
      tokens.push({ type: "space", value: val });
    } else if (/^(AND|OR|NOT)$/i.test(val) || val === "(" || val === ")") {
      tokens.push({ type: "operator", value: val });
    } else if (/^[\w-]+$/.test(val)) {
      tokens.push({ type: "term", value: val });
    } else {
      tokens.push({ type: "error", value: val, error: true });
    }
  }

  // simple error detection: operator at start/end or two operators in a row
  let lastType = null;
  tokens.forEach((t, idx) => {
    if (t.type === "space") return;
    if (
      t.type === "operator" &&
      (lastType === null || lastType === "operator")
    ) {
      t.error = true;
    }
    if (idx === tokens.length - 1 && t.type === "operator") {
      t.error = true;
    }
    lastType = t.type;
  });

  return tokens;
}

function renderTokens(tokens) {
  return tokens
    .map((t) => {
      if (t.type === "space") {
        return t.value;
      }
      const classes = ["token"];
      if (t.type === "operator") classes.push("token-operator");
      if (t.type === "term") classes.push("token-term");
      if (t.error) classes.push("token-error");
      return `<span class="${classes.join(" ")}">${escapeHtml(t.value)}</span>`;
    })
    .join("");
}

function updateTokens() {
  const tokens = tokenize(searchInput.value);
  tokenOverlay.innerHTML = renderTokens(tokens);
  const hasError = tokens.some((t) => t.error);
  searchInput.classList.toggle("input-error", hasError);
}

function getCaretCoordinates(input) {
  const style = window.getComputedStyle(input);
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.visibility = "hidden";
  div.style.whiteSpace = "pre";
  div.style.font = style.font;
  div.style.padding = style.padding;
  div.textContent = input.value.substring(0, input.selectionStart);
  document.body.appendChild(div);
  const x = div.offsetWidth;
  document.body.removeChild(div);
  const rect = input.getBoundingClientRect();
  return {
    x: rect.left + x - input.scrollLeft + window.scrollX,
    y: rect.top + rect.height + window.scrollY,
  };
}

function positionHelp() {
  const coords = getCaretCoordinates(searchInput);
  helpPopover.style.left = `${coords.x}px`;
  helpPopover.style.top = `${coords.y}px`;
}

searchInput.addEventListener("focus", () => {
  helpPopover.style.display = "block";
  positionHelp();
  updateTokens();
});

["keyup", "click", "input"].forEach((evt) =>
  searchInput.addEventListener(evt, () => {
    positionHelp();
    updateTokens();
  }),
);

searchInput.addEventListener("blur", () => {
  helpPopover.style.display = "none";
});

let currentLetterFilter = "All";
let termsData = { terms: [] };
let draggedTerm = null;

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}

if (darkModeToggle) {
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
      "darkMode",
      document.body.classList.contains("dark-mode"),
    );
  });
}

if (resetOrderBtn) {
  resetOrderBtn.addEventListener("click", () => {
    localStorage.removeItem("termOrder");
    termsData.terms.sort((a, b) => a.term.localeCompare(b.term));
    populateTermsList();
  });
}

window.addEventListener("DOMContentLoaded", () => {
  loadTerms();
});

function showSkeletons() {
  termsList.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const skel = document.createElement("div");
    skel.className = "skeleton";
    skel.style.height = "1.5rem";
    skel.style.marginBottom = "0.5rem";
    termsList.appendChild(skel);
  }
}

function loadTerms() {
  showSkeletons();
  fetch("terms.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      termsData = data;
      removeDuplicateTermsAndDefinitions();
      termsData.terms.sort((a, b) => a.term.localeCompare(b.term));
      const storedOrder = JSON.parse(localStorage.getItem("termOrder") || "[]");
      if (storedOrder.length) {
        termsData.terms.sort((a, b) => {
          const idxA = storedOrder.indexOf(a.term);
          const idxB = storedOrder.indexOf(b.term);
          if (idxA === -1 && idxB === -1) {
            return a.term.localeCompare(b.term);
          }
          if (idxA === -1) return 1;
          if (idxB === -1) return -1;
          return idxA - idxB;
        });
      }
      buildAlphaNav();
      populateTermsList();

      if (window.location.hash) {
        const termFromHash = decodeURIComponent(
          window.location.hash.substring(1),
        );
        const matchedTerm = termsData.terms.find(
          (t) => t.term.toLowerCase() === termFromHash.toLowerCase(),
        );
        if (matchedTerm) {
          displayDefinition(matchedTerm);
        }
      }
    })
    .catch((error) => {
      console.error("Detailed error fetching data:", error);
      definitionContainer.style.display = "block";
      definitionContainer.innerHTML =
        "<p>Unable to load dictionary data. Please check your connection and try again.</p>" +
        '<button id="retry-fetch">Retry</button>';
      const retryBtn = document.getElementById("retry-fetch");
      if (retryBtn) {
        retryBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          loadTerms();
        });
      }
    });
}

function removeDuplicateTermsAndDefinitions() {
  const uniqueTerms = new Set();
  const uniqueTermsData = [];

  termsData.terms.forEach((item) => {
    const lowerCaseTerm = item.term.toLowerCase();
    if (!uniqueTerms.has(lowerCaseTerm)) {
      uniqueTerms.add(lowerCaseTerm);
      uniqueTermsData.push(item);
    }
  });

  termsData.terms = uniqueTermsData;
}

function toggleFavorite(term) {
  if (favorites.has(term)) {
    favorites.delete(term);
  } else {
    favorites.add(term);
  }
  try {
    localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)));
  } catch (e) {
    // Ignore storage errors
  }
}

function getRatings() {
  try {
    return JSON.parse(localStorage.getItem("ratings") || "{}");
  } catch (e) {
    return {};
  }
}

function getRating(term) {
  const ratings = getRatings();
  return ratings[term] || 0;
}

function saveRating(term, value) {
  const ratings = getRatings();
  ratings[term] = value;
  try {
    localStorage.setItem("ratings", JSON.stringify(ratings));
  } catch (e) {
    // Ignore storage errors
  }
}

function highlightActiveButton(button) {
  alphaNav
    .querySelectorAll("button")
    .forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");
}

function buildAlphaNav() {
  const letters = Array.from(
    new Set(termsData.terms.map((t) => t.term.charAt(0).toUpperCase())),
  ).sort();

  const allButton = document.createElement("button");
  allButton.textContent = "All";
  allButton.addEventListener("click", () => {
    currentLetterFilter = "All";
    highlightActiveButton(allButton);
    populateTermsList();
  });
  alphaNav.appendChild(allButton);

  letters.forEach((letter) => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.addEventListener("click", () => {
      currentLetterFilter = letter;
      highlightActiveButton(btn);
      populateTermsList();
    });
    alphaNav.appendChild(btn);
  });

  highlightActiveButton(allButton);
}

function populateTermsList() {
  termsList.innerHTML = "";
  const searchValue = searchInput.value.trim().toLowerCase();
  termsData.terms.forEach((item) => {
    const matchesSearch = item.term.toLowerCase().includes(searchValue);
    const matchesFavorites =
      !showFavoritesToggle ||
      !showFavoritesToggle.checked ||
      favorites.has(item.term);
    const matchesLetter =
      currentLetterFilter === "All" ||
      item.term.charAt(0).toUpperCase() === currentLetterFilter;
    if (matchesSearch && matchesFavorites && matchesLetter) {
      const termDiv = document.createElement("div");
      termDiv.classList.add("dictionary-item");
      termDiv.dataset.term = item.term;
      termDiv.draggable = true;
      termDiv.tabIndex = 0;
      termDiv.addEventListener("dragstart", handleDragStart);
      termDiv.addEventListener("dragover", handleDragOver);
      termDiv.addEventListener("drop", handleDrop);
      termDiv.addEventListener("keydown", handleKeyDown);

      const termHeader = document.createElement("h3");
      if (searchValue) {
        const escaped = searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`(${escaped})`, "gi");
        termHeader.innerHTML = item.term.replace(regex, "<mark>$1</mark>");
      } else {
        termHeader.textContent = item.term;
      }

      const star = document.createElement("span");
      star.classList.add("favorite-star");
      star.textContent = "★";
      if (favorites.has(item.term)) {
        star.classList.add("favorited");
      }
      star.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(item.term);
        star.classList.toggle("favorited");
        if (showFavoritesToggle && showFavoritesToggle.checked) {
          populateTermsList();
        }
      });
      termHeader.appendChild(star);
      termDiv.appendChild(termHeader);

      const definitionPara = document.createElement("p");
      definitionPara.textContent = item.definition;
      termDiv.appendChild(definitionPara);

      termDiv.addEventListener("click", () => {
        displayDefinition(item);
      });

      termsList.appendChild(termDiv);
    }
  });
}

function saveOrder() {
  try {
    localStorage.setItem(
      "termOrder",
      JSON.stringify(termsData.terms.map((t) => t.term)),
    );
  } catch (e) {
    // Ignore storage errors
  }
}

function moveTerm(fromIndex, toIndex, term) {
  if (fromIndex === toIndex) return;
  const [moved] = termsData.terms.splice(fromIndex, 1);
  termsData.terms.splice(toIndex, 0, moved);
  saveOrder();
  populateTermsList();
  const focusEl = termsList.querySelector(`[data-term="${term}"]`);
  if (focusEl) {
    focusEl.focus();
  }
}

function handleDragStart(e) {
  draggedTerm = e.currentTarget.dataset.term;
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  const targetTerm = e.currentTarget.dataset.term;
  const from = termsData.terms.findIndex((t) => t.term === draggedTerm);
  const to = termsData.terms.findIndex((t) => t.term === targetTerm);
  if (from !== -1 && to !== -1) {
    moveTerm(from, to, draggedTerm);
  }
  draggedTerm = null;
}

function handleKeyDown(e) {
  const term = e.currentTarget.dataset.term;
  const index = termsData.terms.findIndex((t) => t.term === term);
  if (e.key === "ArrowUp" && e.ctrlKey) {
    if (index > 0) {
      moveTerm(index, index - 1, term);
    }
    e.preventDefault();
  } else if (e.key === "ArrowDown" && e.ctrlKey) {
    if (index < termsData.terms.length - 1) {
      moveTerm(index, index + 1, term);
    }
    e.preventDefault();
  }
}

function displayDefinition(term) {
  definitionContainer.style.display = "block";
  const currentRating = getRating(term.term);
  const stars = Array.from({ length: 5 }, (_, i) => {
    const value = i + 1;
    const rated = value <= currentRating ? "rated" : "";
    return `<span class="rating-star ${rated}" data-value="${value}" role="radio" aria-label="${value} out of 5">★</span>`;
  }).join("");
  definitionContainer.innerHTML = `<h3>${term.term}</h3><p>${term.definition}</p><div class="rating-widget" role="radiogroup" aria-label="Rate difficulty">${stars}</div>`;
  window.location.hash = encodeURIComponent(term.term);
  if (canonicalLink) {
    canonicalLink.setAttribute(
      "href",
      `${siteUrl}#${encodeURIComponent(term.term)}`,
    );
  }
  const starElems = definitionContainer.querySelectorAll(".rating-star");
  starElems.forEach((star) => {
    star.addEventListener("click", (e) => {
      e.stopPropagation();
      const value = parseInt(star.getAttribute("data-value"), 10);
      saveRating(term.term, value);
      starElems.forEach((s) => {
        const v = parseInt(s.getAttribute("data-value"), 10);
        s.classList.toggle("rated", v <= value);
      });
    });
  });
}

function clearDefinition() {
  definitionContainer.style.display = "none";
  definitionContainer.innerHTML = "";
  history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search,
  );
  if (canonicalLink) {
    canonicalLink.setAttribute("href", siteUrl);
  }
}

function showRandomTerm() {
  const ratings = getRatings();
  let pool = termsData.terms.slice();
  const maxRating = Math.max(...pool.map((t) => ratings[t.term] || 0));
  if (maxRating > 0) {
    pool = pool.filter((t) => (ratings[t.term] || 0) === maxRating);
  }
  const randomTerm = pool[Math.floor(Math.random() * pool.length)];
  displayDefinition(randomTerm);

  const today = new Date().toDateString();
  try {
    localStorage.setItem(
      "lastRandomTerm",
      JSON.stringify({ date: today, term: randomTerm }),
    );
  } catch (e) {
    // Ignore storage errors
  }
}

randomButton.addEventListener("click", showRandomTerm);
if (showFavoritesToggle) {
  showFavoritesToggle.addEventListener("change", () => {
    clearDefinition();
    populateTermsList();
  });
}

(function initializeDailyTerm() {
  const today = new Date().toDateString();
  try {
    const stored = localStorage.getItem("lastRandomTerm");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today && parsed.term) {
        displayDefinition(parsed.term);
        return;
      }
    }
  } catch (e) {
    // Ignore parse errors and fall back to showing a random term
  }

  showRandomTerm();
})();

searchInput.addEventListener("input", () => {
  clearDefinition();
  populateTermsList();
});

const scrollBtn = document.getElementById("scrollToTopBtn");
window.addEventListener("scroll", () => {
  scrollBtn.style.display = window.scrollY > 200 ? "block" : "none";
});
scrollBtn.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

definitionContainer.addEventListener("click", clearDefinition);

// Export logic with progress indicator and cancellation
const exportBtn = document.getElementById("export-terms");
const exportStatus = document.getElementById("export-status");
const cancelExportBtn = document.getElementById("cancel-export");
const toast = document.getElementById("toast");
let exportController = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
    toast.hidden = true;
  }, 3000);
}

function exportFinished(success) {
  exportBtn.disabled = false;
  exportStatus.hidden = true;
  exportController = null;
  if (success) {
    showToast("Export complete");
  }
}

function startExport() {
  if (exportController) return;
  exportController = new AbortController();
  const { signal } = exportController;
  exportBtn.disabled = true;
  exportStatus.hidden = false;

  const chunkSize = 20;
  const total = termsData.terms.length;
  const data = [];

  function processChunk(index) {
    if (signal.aborted) {
      exportFinished(false);
      return;
    }

    data.push(...termsData.terms.slice(index, index + chunkSize));

    if (index + chunkSize < total) {
      setTimeout(() => processChunk(index + chunkSize), 0);
    } else {
      const blob = new Blob([JSON.stringify({ terms: data }, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "terms-export.json";
      a.click();
      URL.revokeObjectURL(url);
      exportFinished(true);
    }
  }

  processChunk(0);
}

if (exportBtn && cancelExportBtn) {
  exportBtn.addEventListener("click", startExport);
  cancelExportBtn.addEventListener("click", () => {
    if (exportController) {
      exportController.abort();
    }
  });
}

function showSnackbar(message, actionLabel, action) {
  if (!snackbar) return;
  snackbar.innerHTML = "";
  const span = document.createElement("span");
  span.textContent = message;
  const button = document.createElement("button");
  button.textContent = actionLabel;
  button.addEventListener("click", () => {
    action();
    hideSnackbar();
  });
  snackbar.appendChild(span);
  snackbar.appendChild(button);
  snackbar.hidden = false;
  snackbar.classList.add("show");
  setTimeout(() => hideSnackbar(), 5000);
}

function hideSnackbar() {
  if (!snackbar) return;
  snackbar.classList.remove("show");
  snackbar.hidden = true;
}

function shouldClearKey(key) {
  const CONFIG_KEYS = [
    "darkMode",
    "citation-style",
    "onboarding-checklist",
    "readingControls.fontSize",
    "readingControls.lineHeight",
    "readingControls.contentWidth",
    "standardsTable",
    "lastRandomTerm",
  ];
  const CONFIG_PREFIXES = ["sort-"];
  return (
    CONFIG_KEYS.includes(key) ||
    CONFIG_PREFIXES.some((prefix) => key.startsWith(prefix))
  );
}

function clearConfiguration() {
  const snapshot = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && shouldClearKey(key)) {
      snapshot[key] = localStorage.getItem(key);
    }
  }
  Object.keys(snapshot).forEach((key) => localStorage.removeItem(key));
  document.body.classList.remove("dark-mode");
  return snapshot;
}

function restoreConfiguration(snapshot) {
  Object.entries(snapshot).forEach(([key, value]) => {
    if (value !== null) {
      localStorage.setItem(key, value);
    }
  });
  if (snapshot["darkMode"] === "true") {
    document.body.classList.add("dark-mode");
  }
}

if (resetSettingsBtn) {
  resetSettingsBtn.addEventListener("click", () => {
    const snapshot = clearConfiguration();
    showSnackbar("Settings reset", "Undo", () =>
      restoreConfiguration(snapshot),
    );
  });
}
