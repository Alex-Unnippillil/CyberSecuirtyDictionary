// Listening quiz script
let terms = [];
let currentTerm = null;

function loadTerms() {
  return fetch("../terms.json")
    .then((res) => res.json())
    .then((data) => {
      terms = data.terms || [];
    });
}

function getRandomTerm() {
  if (!terms.length) return null;
  const index = Math.floor(Math.random() * terms.length);
  return terms[index].term;
}

function speakTerm(term) {
  if (!term) return;
  const utterance = new SpeechSynthesisUtterance(term);
  speechSynthesis.speak(utterance);
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1,
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function newQuestion() {
  currentTerm = getRandomTerm();
  speakTerm(currentTerm);
}

document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById("play-audio");
  const submitBtn = document.getElementById("submit");
  const answerInput = document.getElementById("answer");
  const feedback = document.getElementById("feedback");

  loadTerms().then(() => {
    newQuestion();
  });

  playBtn.addEventListener("click", () => {
    if (!currentTerm) {
      newQuestion();
    } else {
      speakTerm(currentTerm);
    }
  });

  submitBtn.addEventListener("click", () => {
    if (!currentTerm) return;
    const guess = answerInput.value.trim();
    const distance = levenshtein(
      guess.toLowerCase(),
      currentTerm.toLowerCase(),
    );
    if (distance === 0) {
      feedback.textContent = "Correct!";
    } else if (distance <= 2) {
      feedback.textContent = `Close! The term was "${currentTerm}".`;
    } else {
      feedback.textContent = `Incorrect. The term was "${currentTerm}".`;
    }
    answerInput.value = "";
    currentTerm = null;
  });
});
