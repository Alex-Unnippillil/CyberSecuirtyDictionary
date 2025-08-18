const termsList = document.getElementById("terms-list");
const definitionContainer = document.getElementById("definition-container");
const searchInput = document.getElementById("search");
const alphaNav = document.getElementById("alpha-nav");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const recentTermsContainer = document.getElementById("recent-terms");
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

let currentLetterFilter = "All";
let termsData = { terms: [] };
let recentTerms = JSON.parse(localStorage.getItem("recentTerms")) || [];

// Apply persisted theme preference
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

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
      buildAlphaNav();
      populateTermsList();
      renderRecentTerms();
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

function populateTermsList() {
  termsList.innerHTML = "";
  const searchValue = searchInput.value.trim().toLowerCase();
  termsData.terms.forEach((term) => {
    if (isMatchingTerm(term)) {
      const listItem = document.createElement("li");
      if (searchValue) {
        const termText = term.term;
        const index = termText.toLowerCase().indexOf(searchValue);
        const before = termText.slice(0, index);
        const match = termText.slice(index, index + searchValue.length);
        const after = termText.slice(index + searchValue.length);
        listItem.innerHTML = `${before}<mark>${match}</mark>${after}`;
      } else {
        listItem.textContent = term.term;
      }
      listItem.addEventListener("click", () => {
        displayDefinition(term);
      });
      termsList.appendChild(listItem);
    }
  });
}

function isMatchingTerm(term) {
  const searchValue = searchInput.value.trim().toLowerCase();
  const matchesSearch =
    searchValue === "" || term.term.toLowerCase().includes(searchValue);
  const matchesLetter =
    currentLetterFilter === "All" ||
    term.term.charAt(0).toUpperCase() === currentLetterFilter;
  return matchesSearch && matchesLetter;
}

function displayDefinition(term) {
  definitionContainer.style.display = "block";
  definitionContainer.innerHTML = `<h3>${term.term}</h3><p>${term.definition}</p>`;
  updateRecentTerms(term.term);
}

function updateRecentTerms(term) {
  recentTerms = recentTerms.filter((t) => t !== term);
  recentTerms.unshift(term);
  if (recentTerms.length > 5) recentTerms.pop();
  localStorage.setItem("recentTerms", JSON.stringify(recentTerms));
  renderRecentTerms();
}

function renderRecentTerms() {
  recentTermsContainer.innerHTML = "";
  if (recentTerms.length === 0) return;

  const title = document.createElement("h4");
  title.textContent = "Recent Terms";
  recentTermsContainer.appendChild(title);

  const list = document.createElement("ul");
  recentTerms.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    li.addEventListener("click", () => {
      const termObj = termsData.terms.find((item) => item.term === t);
      if (termObj) displayDefinition(termObj);
    });
    list.appendChild(li);
  });
  recentTermsContainer.appendChild(list);

  const clearBtn = document.createElement("button");
  clearBtn.id = "clear-history";
  clearBtn.textContent = "Clear History";
  clearBtn.addEventListener("click", clearHistory);
  recentTermsContainer.appendChild(clearBtn);
}

function clearHistory() {
  recentTerms = [];
  localStorage.removeItem("recentTerms");
  renderRecentTerms();
}

searchInput.addEventListener("input", populateTermsList);

const scrollThreshold = 200;
function toggleScrollToTopBtn() {
  if (window.scrollY > scrollThreshold) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
}

window.addEventListener("scroll", toggleScrollToTopBtn);
scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

toggleScrollToTopBtn();

// Initial render of recent terms if available
renderRecentTerms();
