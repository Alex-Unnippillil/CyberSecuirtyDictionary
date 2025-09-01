const textarea = document.getElementById('paste-input');
const originalPre = document.getElementById('original');
const sanitizedPre = document.getElementById('sanitized');
const copyBtn = document.getElementById('copy-clean');

function stripHidden(text) {
  // Remove control characters except tab, newline, and carriage return
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

function diffView(original, cleaned) {
  let result = '';
  let j = 0;
  for (let i = 0; i < original.length; i++) {
    const o = original[i];
    const c = cleaned[j];
    if (o === c) {
      result += o;
      j++;
    } else {
      const code = o.charCodeAt(0).toString(16).padStart(2, '0');
      result += `<span class="removed" title="0x${code}">\\x${code}</span>`;
    }
  }
  return result;
}

textarea.addEventListener('paste', (e) => {
  e.preventDefault();
  const text = (e.clipboardData || window.clipboardData).getData('text');
  const cleaned = stripHidden(text);
  textarea.value = cleaned;
  originalPre.innerHTML = diffView(text, cleaned);
  sanitizedPre.textContent = cleaned;
  copyBtn.disabled = cleaned.length === 0;
});

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(sanitizedPre.textContent);
});
