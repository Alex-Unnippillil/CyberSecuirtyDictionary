const flashcard = document.getElementById("flashcard");
const correctBtn = document.getElementById("correct");
const incorrectBtn = document.getElementById("incorrect");

let terms = [];
let currentIndex = 0;
let revealState = "question";
let touchStartX = 0;

fetch("terms.json")
  .then((res) => res.json())
  .then((data) => {
    terms = data.terms;
    showCard();
  });

function showCard() {
  revealState = "question";
  const term = terms[currentIndex];
  flashcard.textContent = term.definition;
  flashcard.classList.remove("revealed");
}

function getHint(term) {
  if (!term.term) return "";
  const first = term.term.charAt(0);
  return first + "_".repeat(term.term.length - 1);
}

function reveal() {
  const term = terms[currentIndex];
  if (revealState === "question") {
    flashcard.textContent = getHint(term);
    revealState = "hint";
  } else if (revealState === "hint") {
    flashcard.textContent = term.term;
    revealState = "answer";
    flashcard.classList.add("revealed");
  }
}

function nextCard(correct) {
  flashcard.classList.add(correct ? "slide-right" : "slide-left");
  const handle = () => {
    flashcard.removeEventListener("transitionend", handle);
    flashcard.classList.remove("slide-right", "slide-left", "revealed");
    currentIndex = (currentIndex + 1) % terms.length;
    showCard();
  };
  flashcard.addEventListener("transitionend", handle);
}

flashcard.addEventListener("click", reveal);
flashcard.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});
flashcard.addEventListener("touchend", (e) => {
  const diffX = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(diffX) < 10) {
    reveal();
  } else if (diffX > 30) {
    nextCard(true);
  } else if (diffX < -30) {
    nextCard(false);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    reveal();
  } else if (e.code === "ArrowRight") {
    nextCard(true);
  } else if (e.code === "ArrowLeft") {
    nextCard(false);
  }
});

correctBtn.addEventListener("click", () => nextCard(true));
incorrectBtn.addEventListener("click", () => nextCard(false));
