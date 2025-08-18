const termsList = document.getElementById("terms-list");
const definitionContainer = document.getElementById("definition-container");
const searchInput = document.getElementById("search");
const alphaNav = document.getElementById("alpha-nav");
const printBtn = document.getElementById("print-btn");

let currentLetterFilter = "All";
=======
const darkModeToggle = document.getElementById("dark-mode-toggle");

=======
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
=======

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
  termsData.terms.sort((a, b) => a.term.localeCompare(b.term));

  termsData.terms.forEach((item) => {
    const termDiv = document.createElement("div");
    termDiv.classList.add("dictionary-item");

    const termHeader = document.createElement("h3");
    termHeader.textContent = item.term;
    termDiv.appendChild(termHeader);

    const definitionPara = document.createElement("p");
    definitionPara.textContent = item.definition;
    termDiv.appendChild(definitionPara);

    termDiv.addEventListener("click", () => {
      displayDefinition(item);
    });

    termsList.appendChild(termDiv);
  });
}

// Prepare data and render
removeDuplicateTermsAndDefinitions();
termsData.terms.sort((a, b) => a.term.localeCompare(b.term));
buildAlphaNav();
populateTermsList();

function populateTermsList() {
  termsList.innerHTML = "";
=======
function populateTermsList() {
  termsList.innerHTML = "";
=======
  const searchValue = searchInput.value.trim().toLowerCase();
=======
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
  definitionContainer.innerHTML = `
    <h3>${term.term}</h3>
    <p>${term.definition}</p>
    <button id="print-term-btn" class="print-btn">Print</button>
  `;
  const termPrintBtn = document.getElementById("print-term-btn");
  termPrintBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    window.print();
  });
}

// Handle the search input event
=======
searchInput.addEventListener("input", populateTermsList);
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
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
=======
searchInput.addEventListener("input", populateTermsList);

if (printBtn) {
  printBtn.addEventListener("click", () => {
    window.print();
  });
}
