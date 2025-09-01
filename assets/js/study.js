const cardEl = document.getElementById('card');
const termEl = document.getElementById('term');
const defEl = document.getElementById('definition');
const againBtn = document.getElementById('again');
const hardBtn = document.getElementById('hard');
const goodBtn = document.getElementById('good');
const easyBtn = document.getElementById('easy');

let terms = [];
let index = 0;

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function loadTerms() {
  fetch('terms.json')
    .then((res) => res.json())
    .then((data) => {
      terms = shuffle(data.terms);
      showCard();
    })
    .catch(() => {
      termEl.textContent = 'Failed to load cards.';
    });
}

function showCard() {
  if (!terms.length) {
    termEl.textContent = 'No cards available';
    defEl.textContent = '';
    return;
  }
  const card = terms[index % terms.length];
  termEl.textContent = card.term;
  defEl.textContent = card.definition;
  defEl.style.display = 'none';
}

cardEl.addEventListener('click', () => {
  defEl.style.display = defEl.style.display === 'none' ? 'block' : 'none';
});

function sendRating(rating) {
  const card = terms[index % terms.length];
  const apiBase = window.__API_BASE__ || '';
  fetch(`${apiBase}/api/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ term: card.term, rating }),
  }).catch(() => {
    // Ignore network errors
  });
}

function handleRating(rating) {
  sendRating(rating);
  index += 1;
  showCard();
}

againBtn.addEventListener('click', () => handleRating('again'));
hardBtn.addEventListener('click', () => handleRating('hard'));
goodBtn.addEventListener('click', () => handleRating('good'));
easyBtn.addEventListener('click', () => handleRating('easy'));

loadTerms();
