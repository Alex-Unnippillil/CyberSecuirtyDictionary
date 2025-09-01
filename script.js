const termsList = document.getElementById("terms-list");
const definitionContainer = document.getElementById("definition-container");
const searchInput = document.getElementById("search");
const randomButton = document.getElementById("random-term");
const alphaNav = document.getElementById("alpha-nav");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const showFavoritesToggle = document.getElementById("show-favorites");
const favorites = new Set(
  JSON.parse(localStorage.getItem("favorites") || "[]"),
);
const siteUrl = "https://alex-unnippillil.github.io/CyberSecuirtyDictionary/";
const canonicalLink = document.getElementById("canonical-link");

let currentLetterFilter = "All";
let termsData = { terms: [] };

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
      termsData.terms.forEach((t) => {
        t.slug = slugify(t.term);
      });
      termsData.slugMap = new Map(termsData.terms.map((t) => [t.slug, t]));
      termsData.terms.sort((a, b) => a.term.localeCompare(b.term));
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
  termsData.terms
    .sort((a, b) => a.term.localeCompare(b.term))
    .forEach((item) => {
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
  const idiomsBlock = renderIdioms(term);
  if (idiomsBlock) {
    definitionContainer.appendChild(idiomsBlock);
  }
  window.location.hash = encodeURIComponent(term.term);
  if (canonicalLink) {
    canonicalLink.setAttribute(
      "href",
      `${siteUrl}#${encodeURIComponent(term.term)}`,
    );
  }
}

function renderIdioms(term) {
  if (!Array.isArray(term.idioms) || term.idioms.length === 0) {
    return null;
  }
  const container = document.createElement("div");
  container.classList.add("idioms-container");
  const header = document.createElement("h4");
  header.textContent = "Idioms";
  container.appendChild(header);
  const list = document.createElement("div");
  list.classList.add("idiom-chips");
  term.idioms.forEach((item) => {
    const slug = typeof item === "string" ? item : item.slug;
    if (!slug) return;
    const target = termsData.slugMap ? termsData.slugMap.get(slug) : null;
    const label =
      (item && typeof item === "object" && item.text) ||
      (target && target.term) ||
      slug;
    const definition =
      (item && typeof item === "object" && item.definition) ||
      (target && target.definition) ||
      "";
    const chip = document.createElement("a");
    chip.classList.add("idiom-chip");
    chip.textContent = label;
    chip.href = `/word/${slug}`;
    chip.addEventListener("click", (e) => e.stopPropagation());
    chip.addEventListener("mouseenter", () => showHoverCard(chip, definition));
    chip.addEventListener("mouseleave", () => hideHoverCard(chip));
    list.appendChild(chip);
  });
  container.appendChild(list);
  return container;
}

function showHoverCard(el, text) {
  if (!text) return;
  const card = document.createElement("div");
  card.classList.add("idiom-hover");
  card.textContent = text;
  el.appendChild(card);
}

function hideHoverCard(el) {
  const card = el.querySelector(".idiom-hover");
  if (card) {
    card.remove();
  }
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
  const randomTerm =
    termsData.terms[Math.floor(Math.random() * termsData.terms.length)];
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
