document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('saved-searches');
  fetch('/api/saved-searches')
    .then(r => r.ok ? r.json() : [])
    .then(data => {
      data.forEach(item => {
        const li = document.createElement('li');

        const link = document.createElement('a');
        link.href = item.url;
        link.textContent = item.query;
        li.appendChild(link);

        const btn = document.createElement('button');
        btn.textContent = 'Run again';
        btn.addEventListener('click', () => {
          window.location.href = item.url;
        });
        li.appendChild(btn);

        list.appendChild(li);
      });
    })
    .catch(err => {
      console.error('Failed to load saved searches', err);
    });
});

