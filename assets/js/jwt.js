const tokenInput = document.getElementById('token-input');
const keyInput = document.getElementById('key-input');
const headerOutput = document.getElementById('header-output');
const payloadOutput = document.getElementById('payload-output');
const verifyResult = document.getElementById('verify-result');
const errorMessage = document.getElementById('error-message');

tokenInput.addEventListener('input', update);
keyInput.addEventListener('input', update);

function base64UrlDecode(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(str.length / 4) * 4, '=');
  try {
    return atob(base64);
  } catch (e) {
    throw new Error('Invalid base64 encoding');
  }
}

function base64UrlToUint8Array(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(str.length / 4) * 4, '=');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function pemToArrayBuffer(pem) {
  const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function update() {
  const token = tokenInput.value.trim();
  const key = keyInput.value.trim();

  headerOutput.textContent = '';
  payloadOutput.textContent = '';
  verifyResult.textContent = '';
  errorMessage.textContent = '';

  if (!token) {
    return;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    errorMessage.textContent = 'Token must have three parts separated by dots.';
    return;
  }

  let header;
  let payload;
  try {
    header = JSON.parse(base64UrlDecode(parts[0]));
  } catch (e) {
    errorMessage.textContent = 'Invalid token header.';
    return;
  }

  try {
    payload = JSON.parse(base64UrlDecode(parts[1]));
  } catch (e) {
    errorMessage.textContent = 'Invalid token payload.';
    return;
  }

  headerOutput.textContent = JSON.stringify(header, null, 2);
  payloadOutput.textContent = JSON.stringify(payload, null, 2);

  if (!key) {
    return;
  }

  try {
    const alg = header.alg;
    let algorithm;
    let keyFormat;
    let keyData;
    if (alg === 'RS256') {
      algorithm = { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' };
      keyFormat = 'spki';
      keyData = pemToArrayBuffer(key);
    } else if (alg === 'HS256') {
      algorithm = { name: 'HMAC', hash: 'SHA-256' };
      keyFormat = 'raw';
      keyData = new TextEncoder().encode(key);
    } else {
      errorMessage.textContent = `Unsupported algorithm: ${alg}`;
      return;
    }

    const cryptoKey = await crypto.subtle.importKey(
      keyFormat,
      keyData,
      algorithm,
      false,
      ['verify']
    );

    const data = new TextEncoder().encode(parts[0] + '.' + parts[1]);
    const signature = base64UrlToUint8Array(parts[2]);
    const valid = await crypto.subtle.verify(algorithm, cryptoKey, signature, data);
    verifyResult.textContent = valid ? 'Signature valid' : 'Invalid signature';
  } catch (e) {
    errorMessage.textContent = e.message;
  }
}
