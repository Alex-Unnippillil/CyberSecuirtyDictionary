async function renderCharts() {
  const res = await fetch('counts.json');
  const counts = await res.json();

  const domainCanvas = document.getElementById('domainChart');
  new Chart(domainCanvas, {
    type: 'bar',
    data: {
      labels: Object.keys(counts.byDomain),
      datasets: [{ label: 'By Domain', data: Object.values(counts.byDomain) }]
    }
  });

  const difficultyCanvas = document.getElementById('difficultyChart');
  new Chart(difficultyCanvas, {
    type: 'bar',
    data: {
      labels: Object.keys(counts.byDifficulty),
      datasets: [{ label: 'By Difficulty', data: Object.values(counts.byDifficulty) }]
    }
  });

  const frameworkCanvas = document.getElementById('frameworkChart');
  new Chart(frameworkCanvas, {
    type: 'bar',
    data: {
      labels: Object.keys(counts.byFramework),
      datasets: [{ label: 'By Framework', data: Object.values(counts.byFramework) }]
    }
  });
}

window.renderCharts = renderCharts;
document.addEventListener('DOMContentLoaded', renderCharts);
