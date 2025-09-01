window.addEventListener('DOMContentLoaded', () => {
  const output = document.getElementById('model-output');
  const sourcesList = document.getElementById('sources-list');
  if (!output || !sourcesList) {
    return;
  }

  const evtSource = new EventSource('/api/stream');

  evtSource.addEventListener('source', (e) => {
    const data = JSON.parse(e.data);
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = data.url;
    link.textContent = data.title || data.url;
    li.appendChild(link);
    sourcesList.appendChild(li);
  });

  evtSource.addEventListener('token', (e) => {
    output.textContent += e.data;
  });

  evtSource.addEventListener('end', () => {
    evtSource.close();
  });
});
