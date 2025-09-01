const button = document.getElementById('start-progress');
const list = document.getElementById('progress-list');

button.addEventListener('click', async () => {
  list.innerHTML = '';
  const response = await fetch('/api/progress');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const item = document.createElement('li');
        item.textContent = line.replace(/^data: /, '').trim();
        list.appendChild(item);
      }
    }
  }
});

