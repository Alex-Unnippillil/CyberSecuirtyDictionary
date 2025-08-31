const STORAGE_KEY = 'quizProgress';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    // Ignore storage errors
  }
}

function renderHeatmap() {
  const heatmap = document.getElementById('heatmap');
  const progress = loadProgress();
  heatmap.innerHTML = '';

  const domains = Object.keys(progress);
  if (domains.length === 0) {
    heatmap.textContent = 'No quiz data yet.';
    return;
  }

  domains.forEach((domain) => {
    const { correct, total } = progress[domain];
    const score = total ? correct / total : 0;
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    cell.style.setProperty('--heat-color', `hsl(${score * 120}, 70%, 50%)`);
    cell.textContent = `${domain}: ${Math.round(score * 100)}%`;
    heatmap.appendChild(cell);
  });
}

function recordQuizResult(domain, isCorrect) {
  const progress = loadProgress();
  if (!progress[domain]) {
    progress[domain] = { correct: 0, total: 0 };
  }
  progress[domain].total += 1;
  if (isCorrect) {
    progress[domain].correct += 1;
  }
  saveProgress(progress);
  renderHeatmap();
}

function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
  renderHeatmap();
}

document.getElementById('reset-progress').addEventListener('click', resetProgress);

renderHeatmap();

window.recordQuizResult = recordQuizResult;
