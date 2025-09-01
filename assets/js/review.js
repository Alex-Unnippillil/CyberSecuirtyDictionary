const BOX_INTERVALS = [1, 2, 4, 7, 15]; // days per box
let db;
let queue = [];
let currentCard = null;

document.addEventListener("DOMContentLoaded", () => {
  init();
});

async function init() {
  db = await openDB();
  await seedCards();
  queue = await getDueCards();
  bindUI();
  showNextCard();
}

function bindUI() {
  document.getElementById("show-answer").addEventListener("click", () => {
    document.getElementById("card-definition").hidden = false;
    document.getElementById("show-answer").hidden = true;
    document.getElementById("grade-correct").hidden = false;
    document.getElementById("grade-incorrect").hidden = false;
  });

  document
    .getElementById("grade-correct")
    .addEventListener("click", () => grade(true));
  document
    .getElementById("grade-incorrect")
    .addEventListener("click", () => grade(false));
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("csd-review", 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("cards")) {
        db.createObjectStore("cards", { keyPath: "term" });
      }
      if (!db.objectStoreNames.contains("logs")) {
        db.createObjectStore("logs", { autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function seedCards() {
  const tx = db.transaction("cards", "readonly");
  const count = await promisify(tx.objectStore("cards").count());
  if (count > 0) return;
  const res = await fetch("terms.json");
  const data = await res.json();
  const write = db.transaction("cards", "readwrite");
  data.terms.forEach((t) => {
    write.objectStore("cards").put({
      term: t.term,
      definition: t.definition,
      box: 1,
      nextReview: Date.now(),
    });
  });
  await txDone(write);
}

async function getDueCards() {
  const tx = db.transaction("cards", "readonly");
  const all = await promisify(tx.objectStore("cards").getAll());
  const now = Date.now();
  return all.filter((c) => c.nextReview <= now);
}

async function grade(correct) {
  if (!currentCard) return;
  if (correct) {
    currentCard.box = Math.min(currentCard.box + 1, BOX_INTERVALS.length);
  } else {
    currentCard.box = 1;
  }
  const days = BOX_INTERVALS[currentCard.box - 1];
  currentCard.nextReview = Date.now() + days * 24 * 60 * 60 * 1000;
  await saveCard(currentCard);
  await logReview(currentCard.term, correct);
  showNextCard();
}

function showNextCard() {
  currentCard = queue.shift();
  const termEl = document.getElementById("card-term");
  const defEl = document.getElementById("card-definition");
  const showBtn = document.getElementById("show-answer");
  const correctBtn = document.getElementById("grade-correct");
  const incorrectBtn = document.getElementById("grade-incorrect");

  if (!currentCard) {
    termEl.textContent = "No cards due";
    defEl.textContent = "";
    showBtn.hidden = true;
    correctBtn.hidden = true;
    incorrectBtn.hidden = true;
    return;
  }

  termEl.textContent = currentCard.term;
  defEl.textContent = currentCard.definition;
  defEl.hidden = true;
  showBtn.hidden = false;
  correctBtn.hidden = true;
  incorrectBtn.hidden = true;
}

function saveCard(card) {
  const tx = db.transaction("cards", "readwrite");
  tx.objectStore("cards").put(card);
  return txDone(tx);
}

function logReview(term, correct) {
  const tx = db.transaction("logs", "readwrite");
  tx.objectStore("logs").add({ term, correct, timestamp: Date.now() });
  return txDone(tx);
}

function promisify(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function txDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
