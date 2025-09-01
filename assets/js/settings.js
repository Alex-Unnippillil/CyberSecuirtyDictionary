import { indexSettings } from "./settings-index.js";

const searchInput = document.getElementById("settings-search");
const resultsList = document.getElementById("settings-search-results");
const settingsRoot = document.getElementById("settings-root");
const index = indexSettings(settingsRoot);

function clearResults() {
  while (resultsList.firstChild) {
    resultsList.removeChild(resultsList.firstChild);
  }
}

function renderResults(query) {
  clearResults();
  if (!query) return;
  const q = query.toLowerCase();
  index
    .filter((item) => {
      return (
        item.label.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.includes(q))
      );
    })
    .forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.label;
      li.addEventListener("click", () => {
        const details = item.element.closest("details");
        if (details) details.open = true;
        item.element.scrollIntoView({ behavior: "smooth", block: "center" });
        item.element.classList.add("settings-highlight");
        setTimeout(
          () => item.element.classList.remove("settings-highlight"),
          2000,
        );
      });
      resultsList.appendChild(li);
    });
}

searchInput.addEventListener("input", () => {
  renderResults(searchInput.value);
});

const darkModeToggle = document.getElementById("dark-mode-toggle");
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
  if (darkModeToggle) darkModeToggle.checked = true;
}
if (darkModeToggle) {
  darkModeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
      "darkMode",
      document.body.classList.contains("dark-mode"),
    );
  });
}

const showFavoritesToggle = document.getElementById("show-favorites");
if (showFavoritesToggle) {
  const stored = localStorage.getItem("showFavorites");
  if (stored === "true") {
    showFavoritesToggle.checked = true;
  }
  showFavoritesToggle.addEventListener("change", () => {
    localStorage.setItem("showFavorites", String(showFavoritesToggle.checked));
  });
}
