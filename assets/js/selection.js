(function () {
  const THRESHOLD = 150; // milliseconds
  let graph = {};
  let featureEnabled = false;

  const infoBox = document.createElement('div');
  infoBox.id = 'selection-info';
  Object.assign(infoBox.style, {
    position: 'absolute',
    display: 'none',
    background: '#fff',
    color: '#000',
    border: '1px solid #ccc',
    padding: '8px',
    maxWidth: '300px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    zIndex: 1000,
  });
  document.body.appendChild(infoBox);

  const loadStart = performance.now();
  fetch('graph.json')
    .then((resp) => resp.json())
    .then((data) => {
      const loadTime = performance.now() - loadStart;
      if (loadTime < THRESHOLD) {
        Object.keys(data).forEach((k) => {
          graph[k.toLowerCase()] = { term: k, ...data[k] };
        });
        featureEnabled = true;
        document.addEventListener('mouseup', handleSelection);
      } else {
        console.warn(`graph.json took ${loadTime}ms to load; selection feature disabled`);
      }
    })
    .catch((err) => console.error('Failed to load graph.json', err));

  function handleSelection(evt) {
    if (!featureEnabled) return;
    const selected = window.getSelection().toString().trim().toLowerCase();
    const entry = graph[selected];
    if (!selected || !entry) {
      infoBox.style.display = 'none';
      return;
    }

    const lookupStart = performance.now();
    let html = `<strong>${entry.term}</strong><p>${entry.definition}</p>`;
    if (entry.related && entry.related.length) {
      const relLinks = entry.related
        .map((r) => `<a href="#${encodeURIComponent(r)}">${r}</a>`)
        .join(', ');
      html += `<p><em>Related:</em> ${relLinks}</p>`;
    }
    if (entry.links && entry.links.length) {
      const navLinks = entry.links
        .map((l) => `<a href="${l}">${l}</a>`)
        .join(', ');
      html += `<p><em>Links:</em> ${navLinks}</p>`;
    }
    const lookupTime = performance.now() - lookupStart;
    if (lookupTime < THRESHOLD) {
      infoBox.innerHTML = html;
      infoBox.style.left = evt.pageX + 10 + 'px';
      infoBox.style.top = evt.pageY + 10 + 'px';
      infoBox.style.display = 'block';
    } else {
      infoBox.style.display = 'none';
      console.warn(`Lookup/display exceeded ${THRESHOLD}ms; skipping.`);
    }
  }
})();
