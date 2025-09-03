import { safeParse } from '../../utils/safeJson';

// Utilities for encoding/decoding text when working with the Web Crypto API.
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// PBKDF2 work factor. Extracted for readability and easier future tuning.
const PBKDF2_ITERATIONS = 250_000;

interface EncryptedPayload {
  cipherText: string;
  iv: string;
  salt: string;
}

function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function deriveKey(
  passphrase: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function promptPassphrase(message: string): Promise<string> {
  const passphrase = window.prompt(message);
  if (!passphrase) {
    throw new Error("Passphrase is required");
  }
  return passphrase;
}

export async function saveEncryptedNote(
  id: string,
  note: string,
): Promise<void> {
  const passphrase = await promptPassphrase("Enter passphrase to secure note");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(note),
  );

  const payload: EncryptedPayload = {
    cipherText: bufferToBase64(cipherBuffer),
    iv: bufferToBase64(iv),
    salt: bufferToBase64(salt),
  };

  localStorage.setItem(id, JSON.stringify(payload));
}

export async function loadEncryptedNote(id: string): Promise<string | null> {
  const stored = localStorage.getItem(id);
  if (!stored) {
    return null;
  }

  try {
    const payload = safeParse<EncryptedPayload | null>(stored, null);
    if (!payload) throw new Error('Invalid payload');
    const passphrase = await promptPassphrase(
      "Enter passphrase to decrypt note",
    );
    const salt = base64ToBuffer(payload.salt);
    const iv = base64ToBuffer(payload.iv);
    const key = await deriveKey(passphrase, salt);
    const cipherText = base64ToBuffer(payload.cipherText);

    const plainBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      cipherText,
    );

    return decoder.decode(plainBuffer);
  } catch (err) {
    alert("Incorrect passphrase or corrupted note");
    return null;
  }
}
