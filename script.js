const termsList = document.getElementById("terms-list");
const definitionContainer = document.getElementById("definition-container");
const searchInput = document.getElementById("search");
const randomButton = document.getElementById("random-term");
const alphaNav = document.getElementById("alpha-nav");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const showFavoritesToggle = document.getElementById("show-favorites");
const favorites = new Set(JSON.parse(localStorage.getItem("favorites") || "[]"));
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
["font", "padding", "border", "boxSizing", "lineHeight", "height"].forEach((prop) => {
  tokenOverlay.style[prop] = inputStyle[prop];
});
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
  return str.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
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
    if (t.type === "operator" && (lastType === null || lastType === "operator")) {
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
  return { x: rect.left + x - input.scrollLeft + window.scrollX, y: rect.top + rect.height + window.scrollY };
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
  })
);

searchInput.addEventListener("blur", () => {
  helpPopover.style.display = "none";
});

let currentLetterFilter = "All";
let termsData = { terms: [] };

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}

if (darkModeToggle) {
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
  });
}

window.addEventListener("DOMContentLoaded", () => {
  loadTerms();
});

function loadTerms() {
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
      buildAlphaNav();
      populateTermsList();

      if (window.location.hash) {
        const termFromHash = decodeURIComponent(window.location.hash.substring(1));
        const matchedTerm = termsData.terms.find(
          (t) => t.term.toLowerCase() === termFromHash.toLowerCase()
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
        '<p>Unable to load dictionary data. Please check your connection and try again.</p>' +
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

function highlightActiveButton(button) {
  alphaNav.querySelectorAll("button").forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");
}

function buildAlphaNav() {
  const letters = Array.from(new Set(termsData.terms.map((t) => t.term.charAt(0).toUpperCase()))).sort();

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
  termsData.terms
    .sort((a, b) => a.term.localeCompare(b.term))
    .forEach((item) => {
      const matchesSearch = item.term.toLowerCase().includes(searchValue);
      const matchesFavorites = !showFavoritesToggle || !showFavoritesToggle.checked || favorites.has(item.term);
      const matchesLetter =
        currentLetterFilter === "All" || item.term.charAt(0).toUpperCase() === currentLetterFilter;
      if (matchesSearch && matchesFavorites && matchesLetter) {
        const termDiv = document.createElement("div");
        termDiv.classList.add("dictionary-item");

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

function displayDefinition(term) {
  definitionContainer.style.display = "block";
  definitionContainer.innerHTML = `<h3>${term.term}</h3><p>${term.definition}</p>`;
  window.location.hash = encodeURIComponent(term.term);
  if (canonicalLink) {
    canonicalLink.setAttribute(
      "href",
      `${siteUrl}#${encodeURIComponent(term.term)}`
    );
  }
}

function clearDefinition() {
  definitionContainer.style.display = "none";
  definitionContainer.innerHTML = "";
  history.replaceState(null, "", window.location.pathname + window.location.search);
  if (canonicalLink) {
    canonicalLink.setAttribute("href", siteUrl);
  }
}

function showRandomTerm() {
  const randomTerm = termsData.terms[Math.floor(Math.random() * termsData.terms.length)];
  displayDefinition(randomTerm);

  const today = new Date().toDateString();
  try {
    localStorage.setItem("lastRandomTerm", JSON.stringify({ date: today, term: randomTerm }));
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
  window.scrollTo({ top: 0, behavior: "smooth" })
);

definitionContainer.addEventListener("click", clearDefinition);

