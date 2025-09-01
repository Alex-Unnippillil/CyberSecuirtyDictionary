let terms = [];
let currentTerm = null;

function pickRandomTerm() {
  if (terms.length === 0) {
    return;
  }
  const index = Math.floor(Math.random() * terms.length);
  currentTerm = terms[index].term;
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, () =>
    new Array(a.length + 1).fill(0),
  );
  for (let i = 0; i <= a.length; i++) {
    matrix[0][i] = i;
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[j][0] = j;
  }
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j - 1][i] + 1,
        matrix[j][i - 1] + 1,
        matrix[j - 1][i - 1] + cost,
      );
    }
  }
  return matrix[b.length][a.length];
}

function checkAnswer() {
  if (!currentTerm) {
    return;
  }
  const inputEl = document.getElementById("user-input");
  const feedback = document.getElementById("feedback");
  const guess = inputEl.value.trim().toLowerCase();
  const target = currentTerm.toLowerCase();
  const distance = levenshtein(guess, target);
  if (distance <= 2) {
    feedback.textContent = "Correct!";
  } else {
    feedback.textContent = `Incorrect. The word was "${currentTerm}".`;
  }
  inputEl.value = "";
  pickRandomTerm();
}

document.getElementById("play-audio").addEventListener("click", () => {
  if (!currentTerm) {
    return;
  }
  const utterance = new SpeechSynthesisUtterance(currentTerm);
  window.speechSynthesis.speak(utterance);
});

document.getElementById("submit-answer").addEventListener("click", checkAnswer);

document.getElementById("user-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkAnswer();
  }
});

fetch("terms.json")
  .then((r) => r.json())
  .then((data) => {
    terms = data.terms || [];
    pickRandomTerm();
  })
  .catch(() => {
    document.getElementById("feedback").textContent = "Failed to load terms.";
  });
