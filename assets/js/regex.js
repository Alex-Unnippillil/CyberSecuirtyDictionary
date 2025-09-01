const patterns = [
  { pattern: '^\\d+$', description: 'Digits only' },
  { pattern: '^[a-zA-Z]+$', description: 'Letters only' },
  { pattern: '^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$', description: 'Simple email address' }
];

const list = document.getElementById('regex-list');
const liveRegion = document.getElementById('live-region');

patterns.forEach(({ pattern, description }) => {
  const li = document.createElement('li');
  li.innerHTML = `
    <p>${description}</p>
    <code>${pattern}</code>
    <button type="button" class="copy-btn">Copy</button>
    <input type="text" class="test-input" placeholder="Enter text to test" aria-label="Test text against pattern: ${description}">
    <span class="result" aria-live="polite"></span>
  `;
  list.appendChild(li);

  const regex = new RegExp(pattern);
  const input = li.querySelector('.test-input');
  const result = li.querySelector('.result');

  input.addEventListener('input', () => {
    if (regex.test(input.value)) {
      input.classList.add('pass');
      input.classList.remove('fail');
      result.textContent = 'Match';
    } else {
      input.classList.add('fail');
      input.classList.remove('pass');
      result.textContent = 'No match';
    }
  });

  const copyBtn = li.querySelector('.copy-btn');
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pattern);
      liveRegion.textContent = 'Pattern copied to clipboard';
    } catch (err) {
      liveRegion.textContent = 'Failed to copy pattern';
    }
  });
});
