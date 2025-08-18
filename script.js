const termsList = document.getElementById("terms-list");
const definitionContainer = document.getElementById("definition-container");
const searchInput = document.getElementById("search");
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

function populateTermsList() {
  termsList.innerHTML = "";
  termsData.terms.forEach((term) => {
    if (isMatchingTerm(term)) {
      const listItem = document.createElement("li");
      listItem.textContent = term.term;
      listItem.addEventListener("click", () => {
        displayDefinition(term);
      });
      termsList.appendChild(listItem);
    }
  });
}

function isMatchingTerm(term) {
  const searchValue = searchInput.value.trim().toLowerCase();
  if (searchValue === "") return true; // Show all terms when the search input is empty
  return term.term.toLowerCase().includes(searchValue);
}

function displayDefinition(term) {
  definitionContainer.style.display = "block";
  definitionContainer.innerHTML = `<h3>${term.term}</h3><p>${term.definition}</p>`;
}

// Handle the search input event
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
