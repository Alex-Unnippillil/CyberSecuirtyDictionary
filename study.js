const termEl = document.getElementById("term");
const defEl = document.getElementById("definition");
const showBtn = document.getElementById("show-answer");
const ratingEl = document.getElementById("rating");
const storageKey = "srsData";
let queue = [];
let current = null;

function loadTerms() {
  fetch("terms.json")
    .then((res) => res.json())
    .then((data) => {
      const now = Date.now();
      const stored = JSON.parse(localStorage.getItem(storageKey) || "{}");
      data.terms.forEach((t) => {
        if (!stored[t.term]) {
          stored[t.term] = { repetition: 0, interval: 0, ef: 2.5, due: 0 };
        }
        if (stored[t.term].due <= now) {
          queue.push({
            term: t.term,
            definition: t.definition,
            ...stored[t.term],
          });
        }
      });
      localStorage.setItem(storageKey, JSON.stringify(stored));
      showNext();
    })
    .catch((err) => {
      termEl.textContent = "Failed to load terms.";
      console.error(err);
    });
}

function showNext() {
  if (queue.length === 0) {
    termEl.textContent = "No cards due";
    defEl.style.display = "none";
    showBtn.style.display = "none";
    ratingEl.style.display = "none";
    return;
  }
  current = queue.shift();
  termEl.textContent = current.term;
  defEl.textContent = current.definition;
  defEl.style.display = "none";
  showBtn.style.display = "inline-block";
  ratingEl.style.display = "none";
}

showBtn.addEventListener("click", () => {
  defEl.style.display = "block";
  showBtn.style.display = "none";
  ratingEl.style.display = "block";
});

ratingEl.addEventListener("click", (e) => {
  const q = e.target.getAttribute("data-quality");
  if (!q) return;
  updateCard(current, Number(q));
  saveCard(current);
  showNext();
});

function updateCard(card, quality) {
  if (quality < 3) {
    card.repetition = 0;
    card.interval = 1;
  } else {
    if (card.repetition === 0) {
      card.interval = 1;
    } else if (card.repetition === 1) {
      card.interval = 6;
    } else {
      card.interval = Math.round(card.interval * card.ef);
    }
    card.repetition += 1;
  }
  card.ef = card.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (card.ef < 1.3) card.ef = 1.3;
  card.due = Date.now() + card.interval * 24 * 60 * 60 * 1000;
}

function saveCard(card) {
  const stored = JSON.parse(localStorage.getItem(storageKey) || "{}");
  stored[card.term] = {
    repetition: card.repetition,
    interval: card.interval,
    ef: card.ef,
    due: card.due,
  };
  localStorage.setItem(storageKey, JSON.stringify(stored));
}

loadTerms();
