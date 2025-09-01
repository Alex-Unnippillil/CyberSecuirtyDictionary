import React from "https://esm.sh/react@18";
import { createRoot } from "https://esm.sh/react-dom@18/client";
import { Virtuoso } from "https://esm.sh/react-virtuoso@4.14.0";
import { motion, AnimatePresence } from "https://esm.sh/framer-motion@12.23.12";

const termsRoot = document.getElementById("terms-list");
const definitionContainer = document.getElementById("definition-container");
const searchInput = document.getElementById("search");
const randomButton = document.getElementById("random-term");
const alphaNav = document.getElementById("alpha-nav");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const showFavoritesToggle = document.getElementById("show-favorites");
const favorites = new Set(JSON.parse(localStorage.getItem("favorites") || "[]"));
const siteUrl = "https://alex-unnippillil.github.io/CyberSecuirtyDictionary/";
const canonicalLink = document.getElementById("canonical-link");

let currentLetterFilter = "All";
let termsData = { terms: [] };
let reactRoot;

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

function highlightTerm(term, searchValue) {
  if (!searchValue) return term;
  const escaped = searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  return term.replace(regex, "<mark>$1</mark>");
}

function TermsVirtuoso({ terms, searchValue }) {
  return (
    React.createElement(AnimatePresence, { mode: "sync" },
      React.createElement(Virtuoso, {
        useWindowScroll: true,
        data: terms,
        itemContent: (index, item) => (
          React.createElement(motion.div, {
            layout: true,
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -10 },
            transition: { duration: 0.2 },
            className: "dictionary-item",
            onClick: () => displayDefinition(item)
          },
            React.createElement("h3", null,
              React.createElement("span", {
                dangerouslySetInnerHTML: { __html: highlightTerm(item.term, searchValue) }
              }),
              React.createElement("span", {
                className: `favorite-star ${favorites.has(item.term) ? "favorited" : ""}`,
                onClick: (e) => {
                  e.stopPropagation();
                  toggleFavorite(item.term);
                  if (showFavoritesToggle && showFavoritesToggle.checked) {
                    populateTermsList();
                  }
                }
              }, "★")
            ),
            React.createElement("p", null, item.definition)
          )
        )
      })
    )
  );
}

function populateTermsList() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const filtered = termsData.terms
    .sort((a, b) => a.term.localeCompare(b.term))
    .filter((item) => {
      const matchesSearch = item.term.toLowerCase().includes(searchValue);
      const matchesFavorites =
        !showFavoritesToggle || !showFavoritesToggle.checked || favorites.has(item.term);
      const matchesLetter =
        currentLetterFilter === "All" || item.term.charAt(0).toUpperCase() === currentLetterFilter;
      return matchesSearch && matchesFavorites && matchesLetter;
    });

  if (!reactRoot) {
    reactRoot = createRoot(termsRoot);
  }
  reactRoot.render(React.createElement(TermsVirtuoso, { terms: filtered, searchValue }));
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

