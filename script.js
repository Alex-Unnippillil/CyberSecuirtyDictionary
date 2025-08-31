const termsList = document.getElementById("terms-list");
const definitionContainer = document.getElementById("definition-container");
const searchInput = document.getElementById("search");
const randomButton = document.getElementById("random-term");
const alphaNav = document.getElementById("alpha-nav");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const showFavoritesToggle = document.getElementById("show-favorites");
const favorites = new Set(JSON.parse(localStorage.getItem("favorites") || "[]"));

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
  fetch("data.json")
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
      handleHashChange();
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
  alphaNav
    .querySelectorAll("button")
    .forEach((btn) => {
      btn.classList.remove("active");
      btn.removeAttribute("aria-current");
    });
  button.classList.add("active");
  button.setAttribute("aria-current", "true");
}

function setLetterFilter(letter) {
  currentLetterFilter = letter;
  const button = alphaNav.querySelector(`button[data-letter="${letter}"]`);
  if (button) {
    highlightActiveButton(button);
  }
  populateTermsList();
}

function handleHashChange() {
  const hash = decodeURIComponent(window.location.hash.substring(1));

  if (!hash || hash === "All") {
    setLetterFilter("All");
    clearDefinition();
    return;
  }

  if (/^[A-Z]$/.test(hash)) {
    setLetterFilter(hash);
    clearDefinition();
    return;
  }

  const matchedTerm = termsData.terms.find(
    (t) => t.term.toLowerCase() === hash.toLowerCase()
  );
  if (matchedTerm) {
    displayDefinition(matchedTerm);
    setLetterFilter(matchedTerm.term.charAt(0).toUpperCase());
  }
}

function buildAlphaNav() {
  alphaNav.innerHTML = "";
  const lettersWithTerms = new Set(
    termsData.terms.map((t) => t.term.charAt(0).toUpperCase())
  );

  const allButton = document.createElement("button");
  allButton.textContent = "All";
  allButton.setAttribute("data-letter", "All");
  allButton.addEventListener("click", () => {
    setLetterFilter("All");
    window.location.hash = "All";
    clearDefinition();
  });
  alphaNav.appendChild(allButton);

  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.setAttribute("data-letter", letter);
    btn.setAttribute("aria-label", `Filter terms starting with ${letter}`);

    if (lettersWithTerms.has(letter)) {
      btn.addEventListener("click", () => {
        setLetterFilter(letter);
        window.location.hash = letter;
        clearDefinition();
      });
    } else {
      btn.disabled = true;
      btn.setAttribute("aria-disabled", "true");
    }
    alphaNav.appendChild(btn);
  }

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
  const encoded = encodeURIComponent(term.term);
  if (window.location.hash.substring(1) !== encoded) {
    window.location.hash = encoded;
  }
}

function clearDefinition() {
  definitionContainer.style.display = "none";
  definitionContainer.innerHTML = "";
  const hash = decodeURIComponent(window.location.hash.substring(1));
  if (hash && !/^(All|[A-Z])$/.test(hash)) {
    window.location.hash = currentLetterFilter === "All" ? "All" : currentLetterFilter;
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

window.addEventListener("hashchange", handleHashChange);

const scrollBtn = document.getElementById("scrollToTopBtn");
window.addEventListener("scroll", () => {
  scrollBtn.style.display = window.scrollY > 200 ? "block" : "none";
});
scrollBtn.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

definitionContainer.addEventListener("click", clearDefinition);

