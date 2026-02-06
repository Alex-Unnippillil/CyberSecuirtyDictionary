const textInput = document.getElementById('text-input');
const saltSizeInput = document.getElementById('salt-size');
const saltSizeVal = document.getElementById('salt-size-val');
const keyLengthInput = document.getElementById('key-length');
const keyLengthVal = document.getElementById('key-length-val');
const hashBtn = document.getElementById('hash-btn');
const resetBtn = document.getElementById('reset-btn');
const saltOutput = document.getElementById('salt-output');
const hashOutput = document.getElementById('hash-output');
const copySaltBtn = document.getElementById('copy-salt');
const copyHashBtn = document.getElementById('copy-hash');
const results = document.getElementById('results');

function updateSliderDisplays() {
  saltSizeVal.textContent = saltSizeInput.value;
  keyLengthVal.textContent = keyLengthInput.value;
}

saltSizeInput.addEventListener('input', updateSliderDisplays);
keyLengthInput.addEventListener('input', updateSliderDisplays);

function generateSalt(length) {
  const salt = new Uint8Array(length);
  crypto.getRandomValues(salt);
  return salt;
}

function bufferToHex(buffer) {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hashText(text, salt, keyLen) {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(text),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt,
      iterations: 100000,
    },
    baseKey,
    keyLen
  );
  return bits;
}

hashBtn.addEventListener('click', async () => {
  const text = textInput.value;
  if (!text) {
    return;
  }
  const salt = generateSalt(parseInt(saltSizeInput.value, 10));
  const derived = await hashText(text, salt, parseInt(keyLengthInput.value, 10));
  saltOutput.textContent = bufferToHex(salt);
  hashOutput.textContent = bufferToHex(derived);
  results.hidden = false;
});

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    if (!successful) {
      throw err;
    }
  }
}

copySaltBtn.addEventListener('click', () => {
  copyToClipboard(saltOutput.textContent);
});

copyHashBtn.addEventListener('click', () => {
  copyToClipboard(hashOutput.textContent);
});

resetBtn.addEventListener('click', () => {
  textInput.value = '';
  results.hidden = true;
});

updateSliderDisplays();
