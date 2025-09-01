(function(){
  function slugify(term){
    return term
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function renderEntry(container, term){
    if(term){
      container.innerHTML = `<h2>${term.term}</h2><p>${term.definition}</p>`;
    } else {
      container.textContent = 'Entry not found';
    }
  }

  function setupSyncScroll(a, b){
    let isSyncing = false;
    a.addEventListener('scroll', () => {
      if(isSyncing) return;
      const ratio = a.scrollTop / (a.scrollHeight - a.clientHeight || 1);
      isSyncing = true;
      b.scrollTop = ratio * (b.scrollHeight - b.clientHeight);
      isSyncing = false;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const leftSlug = params.get('a') || params.get('left');
    const rightSlug = params.get('b') || params.get('right');

    const leftContainer = document.getElementById('entry-left');
    const rightContainer = document.getElementById('entry-right');

    fetch('terms.json')
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(data => {
        const terms = data.terms || data;
        const leftTerm = terms.find(t => slugify(t.term) === leftSlug);
        const rightTerm = terms.find(t => slugify(t.term) === rightSlug);
        renderEntry(leftContainer, leftTerm);
        renderEntry(rightContainer, rightTerm);
      })
      .catch(err => {
        console.error('Failed to load terms.json', err);
        renderEntry(leftContainer, null);
        renderEntry(rightContainer, null);
      });

    setupSyncScroll(leftContainer, rightContainer);
    setupSyncScroll(rightContainer, leftContainer);
  });
})();
