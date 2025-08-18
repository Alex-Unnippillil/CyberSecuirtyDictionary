const termsList = document.getElementById("terms-list");
const definitionContainer = document.getElementById("definition-container");
const searchInput = document.getElementById("search");
const randomButton = document.getElementById("random-term");


let currentLetterFilter = "All";
const darkModeToggle = document.getElementById("dark-mode-toggle");
// Apply persisted theme preference
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}

// Toggle dark mode and store the preference
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode")
  );
});

let termsData = { terms: [] };

window.addEventListener("DOMContentLoaded", () => {
  fetch('data.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      termsData = data;
      removeDuplicateTermsAndDefinitions();
      displayDictionary();
      populateTermsList();
    })
    .catch((error) => {
      definitionContainer.style.display = "block";
      definitionContainer.textContent = "Failed to load dictionary data.";
      console.error("Error fetching data:", error);
    });
});

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

function highlightActiveButton(button) {
  alphaNav.querySelectorAll("button").forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");
}

function buildAlphaNav() {
  const letters = Array.from(
    new Set(termsData.terms.map((t) => t.term.charAt(0).toUpperCase()))
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

function displayDictionary() {
  termsList.innerHTML = "";
  const searchValue = searchInput.value.trim().toLowerCase();
  termsData.terms
    .sort((a, b) => a.term.localeCompare(b.term))
    .forEach((item) => {
      const matchesSearch = item.term.toLowerCase().includes(searchValue);
      const matchesFavorites =
        !showFavoritesToggle.checked || favorites.has(item.term);
      if (matchesSearch && matchesFavorites) {
        const termDiv = document.createElement("div");
        termDiv.classList.add("dictionary-item");

        const termHeader = document.createElement("h3");
        termHeader.textContent = item.term;

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
          if (showFavoritesToggle.checked) {
            displayDictionary();
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

// Prepare data and render
removeDuplicateTermsAndDefinitions();
termsData.terms.sort((a, b) => a.term.localeCompare(b.term));
buildAlphaNav();
populateTermsList();

function displayDefinition(term) {
  definitionContainer.style.display = "block";
  definitionContainer.innerHTML = `<h3>${term.term}</h3><p>${term.definition}</p>`;
  window.location.hash = encodeURIComponent(term.term);
}

function clearDefinition() {
  definitionContainer.style.display = "none";
  definitionContainer.innerHTML = "";
  history.replaceState(null, "", window.location.pathname + window.location.search);
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

// Handle the search input and random term events
searchInput.addEventListener("input", populateTermsList);
randomButton.addEventListener("click", showRandomTerm);

// Show the stored term if it's from today; otherwise display a new random term
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


// Handle the search input event
searchInput.addEventListener("input", () => {
  clearDefinition();
  populateTermsList();
});

definitionContainer.addEventListener("click", clearDefinition);

if (window.location.hash) {
  const termFromHash = decodeURIComponent(window.location.hash.substring(1));
  const matchedTerm = termsData.terms.find(
    (t) => t.term.toLowerCase() === termFromHash.toLowerCase()
  );
  if (matchedTerm) {
    displayDefinition(matchedTerm);
  }
}
