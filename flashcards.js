const BOX_COUNT = 5;
let terms = [];
let leitnerBoxes = {};
let currentIndex = null;
let currentBox = 1;

const termEl = document.getElementById('term');
const definitionEl = document.getElementById('definition');
const showAnswerBtn = document.getElementById('show-answer');
const knowBtn = document.getElementById('know-it');
const dontKnowBtn = document.getElementById('dont-know');
const progressEl = document.getElementById('progress');

window.addEventListener('DOMContentLoaded', () => {
  fetch('terms.json')
    .then(res => res.json())
    .then(data => {
      terms = data.terms;
      initBoxes();
      updateProgress();
      showCard();
    });
});

function initBoxes() {
  try {
    const stored = JSON.parse(localStorage.getItem('leitnerBoxes'));
    if (stored) {
      leitnerBoxes = stored;
    }
  } catch (e) {
    // ignore corrupted storage
  }
  for (let i = 1; i <= BOX_COUNT; i++) {
    if (!Array.isArray(leitnerBoxes[i])) {
      leitnerBoxes[i] = [];
    }
  }
  const present = new Set(Object.values(leitnerBoxes).flat());
  terms.forEach((_, idx) => {
    if (!present.has(idx)) {
      leitnerBoxes[1].push(idx);
    }
  });
  saveBoxes();
}

function saveBoxes() {
  try {
    localStorage.setItem('leitnerBoxes', JSON.stringify(leitnerBoxes));
  } catch (e) {
    // ignore storage errors
  }
}

function getNextCard() {
  for (let i = 1; i <= BOX_COUNT; i++) {
    if (leitnerBoxes[i].length > 0) {
      currentBox = i;
      const rand = Math.floor(Math.random() * leitnerBoxes[i].length);
      currentIndex = leitnerBoxes[i][rand];
      return terms[currentIndex];
    }
  }
  return null;
}

function showCard() {
  const card = getNextCard();
  if (!card) {
    termEl.textContent = 'No cards available';
    definitionEl.textContent = '';
    return;
  }
  termEl.textContent = card.term;
  definitionEl.textContent = card.definition;
  definitionEl.classList.add('hidden');
}

function updateProgress() {
  const parts = [];
  for (let i = 1; i <= BOX_COUNT; i++) {
    parts.push(`Box ${i}: ${leitnerBoxes[i].length}`);
  }
  progressEl.textContent = parts.join(' | ');
}

function moveCard(correct) {
  leitnerBoxes[currentBox] = leitnerBoxes[currentBox].filter(idx => idx !== currentIndex);
  if (correct) {
    const nextBox = Math.min(currentBox + 1, BOX_COUNT);
    leitnerBoxes[nextBox].push(currentIndex);
  } else {
    leitnerBoxes[1].push(currentIndex);
  }
  saveBoxes();
  updateProgress();
  showCard();
}

showAnswerBtn.addEventListener('click', () => {
  definitionEl.classList.remove('hidden');
});
knowBtn.addEventListener('click', () => moveCard(true));
dontKnowBtn.addEventListener('click', () => moveCard(false));
