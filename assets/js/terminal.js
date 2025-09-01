// Read-only terminal with typewriter effect and theme support
function typeWriter(text, element, index) {
  if (index < text.length) {
    element.textContent += text.charAt(index);
    setTimeout(() => typeWriter(text, element, index + 1), 50);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const output = document.getElementById('terminal-output');
  const copyBtn = document.getElementById('terminal-copy');
  const themeBtn = document.getElementById('terminal-theme');
  const container = document.getElementById('terminal');
  let content = '';

  fetch('assets/terminal-content.txt')
    .then((resp) => resp.text())
    .then((text) => {
      content = text;
      typeWriter(content, output, 0);
    })
    .catch(() => {
      content = 'Failed to load content.';
      typeWriter(content, output, 0);
    });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(content);
    });
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      container.classList.toggle('dark');
    });
  }
});
