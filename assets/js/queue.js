const queueList = document.getElementById("queue-list");
let queue = [];

function loadQueue() {
  try {
    queue = JSON.parse(localStorage.getItem("readLaterQueue")) || [];
  } catch (e) {
    queue = [];
  }
}

function saveQueue() {
  try {
    localStorage.setItem("readLaterQueue", JSON.stringify(queue));
  } catch (e) {
    // Ignore storage errors
  }
}

function renderQueue() {
  queueList.innerHTML = "";
  queue.forEach((term, index) => {
    const li = document.createElement("li");
    li.draggable = true;
    li.dataset.index = index;
    const link = document.createElement("a");
    link.href = `index.html#${encodeURIComponent(term)}`;
    link.textContent = term;
    li.appendChild(link);
    queueList.appendChild(li);
  });
}

function handleDragStart(e) {
  if (e.target.tagName === "LI") {
    e.dataTransfer.setData("text/plain", e.target.dataset.index);
  }
}

function handleDrop(e) {
  e.preventDefault();
  const fromIndex = e.dataTransfer.getData("text/plain");
  const targetLi = e.target.closest("li");
  if (fromIndex === "" || !targetLi) return;
  const toIndex = targetLi.dataset.index;
  const [moved] = queue.splice(fromIndex, 1);
  queue.splice(toIndex, 0, moved);
  saveQueue();
  renderQueue();
}

function handleDragOver(e) {
  e.preventDefault();
}

loadQueue();
renderQueue();

queueList.addEventListener("dragstart", handleDragStart);
queueList.addEventListener("dragover", handleDragOver);
queueList.addEventListener("drop", handleDrop);
