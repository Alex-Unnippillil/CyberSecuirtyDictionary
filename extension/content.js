async function init() {
  const response = await fetch(chrome.runtime.getURL('terms.json'));
  const data = await response.json();
  const terms = data.terms;

  const style = document.createElement('style');
  style.textContent = `
    .csd-term { background-color: #fffd75; cursor: help; }
    .csd-tooltip { position: absolute; background: #333; color: #fff; padding: 4px 8px; border-radius: 4px; z-index: 10000; max-width: 250px; }
  `;
  document.head.appendChild(style);

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => processNode(node, terms));

  document.addEventListener('mouseover', e => {
    if (e.target.classList && e.target.classList.contains('csd-term')) {
      const tooltip = document.createElement('div');
      tooltip.className = 'csd-tooltip';
      tooltip.textContent = e.target.dataset.definition;
      document.body.appendChild(tooltip);
      const rect = e.target.getBoundingClientRect();
      tooltip.style.left = `${rect.left + window.scrollX}px`;
      tooltip.style.top = `${rect.bottom + window.scrollY + 4}px`;
      e.target._tooltip = tooltip;
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.classList && e.target.classList.contains('csd-term') && e.target._tooltip) {
      e.target._tooltip.remove();
      e.target._tooltip = null;
    }
  });
}

function processNode(node, terms) {
  const text = node.nodeValue;
  let idx = 0;
  const frag = document.createDocumentFragment();
  let matched = false;
  const lower = text.toLowerCase();
  while (idx < text.length) {
    let foundTerm = null;
    let foundIndex = -1;
    for (const t of terms) {
      const i = lower.indexOf(t.term.toLowerCase(), idx);
      if (i !== -1 && (foundIndex === -1 || i < foundIndex)) {
        foundIndex = i;
        foundTerm = t;
      }
    }
    if (foundTerm === null) break;
    matched = true;
    frag.appendChild(document.createTextNode(text.slice(idx, foundIndex)));
    const span = document.createElement('span');
    span.className = 'csd-term';
    span.textContent = text.substr(foundIndex, foundTerm.term.length);
    span.dataset.definition = foundTerm.definition;
    frag.appendChild(span);
    idx = foundIndex + foundTerm.term.length;
  }
  if (matched) {
    frag.appendChild(document.createTextNode(text.slice(idx)));
    node.parentNode.replaceChild(frag, node);
  }
}

init();
