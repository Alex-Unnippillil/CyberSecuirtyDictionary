const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const feedbackElement = document.getElementById("feedback");
const nextButton = document.getElementById("next-question");
const scoreElement = document.getElementById("score");
const resetButton = document.getElementById("reset-score");

let terms = [];
let currentTerm = null;
let score = parseInt(localStorage.getItem("quizScore") || "0", 10);
let total = parseInt(localStorage.getItem("quizTotal") || "0", 10);

updateScore();

fetch("terms.json")
  .then((res) => res.json())
  .then((data) => {
    terms = data.terms;
    newQuestion();
  });

const stopWords = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "of",
  "to",
  "in",
  "on",
  "for",
  "with",
  "is",
  "by",
  "that",
  "this",
  "from",
  "as",
  "at",
  "it",
  "its",
  "be",
  "are",
  "was",
  "were",
]);

function updateScore() {
  scoreElement.textContent = `${score}/${total}`;
}

function storeScore() {
  try {
    localStorage.setItem("quizScore", score);
    localStorage.setItem("quizTotal", total);
  } catch (e) {
    // Ignore storage errors
  }
}

function getTokens(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => !stopWords.has(w) && w);
}

function getRelatedDistractors(term, count) {
  const termTokens = new Set(getTokens(term.definition));
  const related = terms.filter(
    (t) =>
      t.term !== term.term &&
      getTokens(t.definition).some((w) => termTokens.has(w))
  );
  const pool = related.length >= count ? related : terms.filter((t) => t.term !== term.term);
  const result = [];
  const temp = [...pool];
  while (result.length < count && temp.length) {
    const idx = Math.floor(Math.random() * temp.length);
    result.push(temp.splice(idx, 1)[0]);
  }
  return result;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function newQuestion() {
  feedbackElement.textContent = "";
  nextButton.style.display = "none";
  optionsContainer.innerHTML = "";
  currentTerm = terms[Math.floor(Math.random() * terms.length)];
  questionElement.textContent = `Which term matches the following definition?\n${currentTerm.definition}`;
  const choices = [currentTerm, ...getRelatedDistractors(currentTerm, 3)];
  shuffle(choices);
  choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.textContent = choice.term;
    btn.addEventListener("click", () => selectAnswer(choice));
    optionsContainer.appendChild(btn);
  });
}

function selectAnswer(selected) {
  const correct = selected.term === currentTerm.term;
  total++;
  if (correct) {
    score++;
    feedbackElement.textContent = `Correct! ${currentTerm.term}: ${currentTerm.definition}`;
    feedbackElement.style.color = "green";
  } else {
    feedbackElement.textContent = `Incorrect. The correct answer is ${currentTerm.term}. ${currentTerm.definition}`;
    feedbackElement.style.color = "red";
  }
  storeScore();
  updateScore();
  Array.from(optionsContainer.children).forEach((btn) => (btn.disabled = true));
  nextButton.style.display = "block";
}

nextButton.addEventListener("click", newQuestion);

resetButton.addEventListener("click", () => {
  score = 0;
  total = 0;
  storeScore();
  updateScore();
});
