(function () {
  const form = document.getElementById('anagram-form');
  const wordInput = document.getElementById('anagram-word');
  const lengthInput = document.getElementById('anagram-length');
  const results = document.getElementById('anagram-results');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const word = wordInput.value.trim();
    const len = lengthInput.value.trim();
    if (!word) return;
    const baseUrl = window.__BASE_URL__ || '';
    const params = new URLSearchParams({ word });
    if (len) params.append('length', len);

    fetch(`${baseUrl}/api/anagrams?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((data) => {
        results.innerHTML = '';
        (data.anagrams || []).forEach((term) => {
          const a = document.createElement('a');
          a.textContent = term;
          a.href = `${baseUrl}/#${encodeURIComponent(term)}`;
          a.className = 'chip';
          results.appendChild(a);
        });
      })
      .catch((err) => {
        console.error('Failed to fetch anagrams', err);
        results.textContent = 'Error fetching anagrams';
      });
  });
})();
