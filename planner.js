const planTerms = [
  { term: 'Phishing' },
  { term: 'Phishing Email', prereqs: ['Phishing'] },
  { term: 'Social Engineering Toolkit (SET)', prereqs: ['Phishing', 'Phishing Email'] },
  { term: 'Advanced Persistent Threat (APT)', prereqs: ['Social Engineering Toolkit (SET)'] },
  { term: 'Cyber Espionage', prereqs: ['Advanced Persistent Threat (APT)'] }
];

const masteryKey = 'plannerMastery';
const mastery = new Set(JSON.parse(localStorage.getItem(masteryKey) || '[]'));

function topologicalSort(items) {
  const result = [];
  const visited = new Set();
  const temp = new Set();

  function visit(item) {
    if (visited.has(item.term)) return;
    if (temp.has(item.term)) {
      console.error('Cyclic dependency detected');
      return;
    }
    temp.add(item.term);
    (item.prereqs || []).forEach((pr) => {
      const prereqItem = items.find((i) => i.term === pr);
      if (prereqItem) visit(prereqItem);
    });
    temp.delete(item.term);
    visited.add(item.term);
    result.push(item);
  }

  items.forEach(visit);
  return result;
}

function buildQueue() {
  const sorted = topologicalSort(planTerms);
  const available = sorted.filter(
    (item) =>
      !mastery.has(item.term) && (item.prereqs || []).every((p) => mastery.has(p))
  );
  const queue = available.slice(0, 7);
  renderQueue(queue);
}

function renderQueue(queue) {
  const container = document.getElementById('queue');
  container.innerHTML = '';
  if (queue.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'All terms mastered!';
    container.appendChild(li);
    return;
  }
  queue.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `Day ${index + 1}: ${item.term}`;
    const btn = document.createElement('button');
    btn.textContent = 'Complete Quiz';
    btn.addEventListener('click', () => completeTerm(item.term));
    li.appendChild(btn);
    container.appendChild(li);
  });
}

function completeTerm(term) {
  mastery.add(term);
  localStorage.setItem(masteryKey, JSON.stringify(Array.from(mastery)));
  buildQueue();
}

function resetPlan() {
  mastery.clear();
  localStorage.removeItem(masteryKey);
  buildQueue();
}

document.getElementById('reset-plan').addEventListener('click', resetPlan);
window.addEventListener('DOMContentLoaded', buildQueue);
