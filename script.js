const termsList = document.getElementById("terms-list");
const definitionContainer = document.getElementById("definition-container");
const searchInput = document.getElementById("search");
const randomButton = document.getElementById("random-term");
const alphaNav = document.getElementById("alpha-nav");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const showFavoritesToggle = document.getElementById("show-favorites");
const digestContainer = document.getElementById("digest-container");
const digestPref = document.getElementById("digest-pref");
const favorites = new Set(
  JSON.parse(localStorage.getItem("favorites") || "[]"),
);
const siteUrl = "https://alex-unnippillil.github.io/CyberSecuirtyDictionary/";
const canonicalLink = document.getElementById("canonical-link");

let currentLetterFilter = "All";
let termsData = { terms: [] };

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

if (digestPref) {
  digestPref.checked = localStorage.getItem("digestEnabled") === "true";
  digestPref.addEventListener("change", () => {
    try {
      localStorage.setItem("digestEnabled", digestPref.checked);
    } catch (e) {
      // Ignore storage errors
    }
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
      checkForUpdates();
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
  window.location.hash = encodeURIComponent(term.term);
  if (canonicalLink) {
    canonicalLink.setAttribute(
      "href",
      `${siteUrl}#${encodeURIComponent(term.term)}`,
    );
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

function checkForUpdates() {
  let previousTerms = [];
  try {
    previousTerms = JSON.parse(localStorage.getItem("termsSnapshot")) || [];
  } catch (e) {
    previousTerms = [];
  }
  if (!previousTerms.length) {
    try {
      localStorage.setItem("termsSnapshot", JSON.stringify(termsData.terms));
      localStorage.setItem("lastVisit", new Date().toISOString());
    } catch (e) {
      // Ignore storage errors
    }
    return;
  }

  const changes = { new: [], updated: [] };
  termsData.terms.forEach((term) => {
    const prev = previousTerms.find(
      (p) => p.term.toLowerCase() === term.term.toLowerCase(),
    );
    if (!prev) {
      changes.new.push(term);
    } else if (prev.definition !== term.definition) {
      changes.updated.push(term);
    }
  });

  const lastVisit = localStorage.getItem("lastVisit");
  if (
    (changes.new.length || changes.updated.length) &&
    digestPref &&
    digestPref.checked
  ) {
    renderDigest(changes, lastVisit);
  }

  try {
    localStorage.setItem("termsSnapshot", JSON.stringify(termsData.terms));
    localStorage.setItem("lastVisit", new Date().toISOString());
  } catch (e) {
    // Ignore storage errors
  }
}

function renderDigest(changes, lastVisit) {
  if (!digestContainer) {
    return;
  }

  digestContainer.innerHTML = "";
  if (lastVisit) {
    const info = document.createElement("p");
    info.textContent = `Updates since ${new Date(lastVisit).toLocaleString()}`;
    digestContainer.appendChild(info);
  }

  if (changes.new.length) {
    const newHeader = document.createElement("h3");
    newHeader.textContent = "New Terms";
    digestContainer.appendChild(newHeader);
    const newList = document.createElement("ul");
    changes.new.forEach((t) => {
      const li = document.createElement("li");
      li.textContent = t.term;
      newList.appendChild(li);
    });
    digestContainer.appendChild(newList);
  }

  if (changes.updated.length) {
    const updHeader = document.createElement("h3");
    updHeader.textContent = "Updated Terms";
    digestContainer.appendChild(updHeader);
    const updList = document.createElement("ul");
    changes.updated.forEach((t) => {
      const li = document.createElement("li");
      li.textContent = t.term;
      updList.appendChild(li);
    });
    digestContainer.appendChild(updList);
  }

  const emailBtn = document.createElement("button");
  emailBtn.id = "email-digest";
  emailBtn.textContent = "Email Digest";
  emailBtn.addEventListener("click", () => emailDigest(changes, lastVisit));
  digestContainer.appendChild(emailBtn);

  const closeBtn = document.createElement("button");
  closeBtn.id = "close-digest";
  closeBtn.textContent = "Close";
  closeBtn.addEventListener("click", () => {
    digestContainer.style.display = "none";
  });
  digestContainer.appendChild(closeBtn);

  digestContainer.style.display = "block";
}

function emailDigest(changes, lastVisit) {
  let body = "";
  if (lastVisit) {
    body += `Updates since ${new Date(lastVisit).toLocaleString()}\n\n`;
  }
  if (changes.new.length) {
    body +=
      "New Terms:\n" +
      changes.new.map((t) => `- ${t.term}`).join("\n") +
      "\n\n";
  }
  if (changes.updated.length) {
    body +=
      "Updated Terms:\n" +
      changes.updated.map((t) => `- ${t.term}`).join("\n") +
      "\n";
  }
  window.location.href =
    "mailto:?subject=" +
    encodeURIComponent("Cyber Security Dictionary Digest") +
    "&body=" +
    encodeURIComponent(body);
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
