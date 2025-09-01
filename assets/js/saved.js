(function(){
  const list = document.getElementById('saved-list');
  document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/saved')
      .then(r => r.ok ? r.json() : [])
      .then(items => {
        items.forEach(item => {
          const li = document.createElement('li');
          const url = `../search.html?q=${encodeURIComponent(item.query)}`;
          const a = document.createElement('a');
          a.href = url;
          a.textContent = item.query;
          li.appendChild(a);
          list.appendChild(li);
        });
      })
      .catch(err => {
        console.error('Failed to load saved searches', err);
      });
  });
})();
