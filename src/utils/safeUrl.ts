export function safeUrl(path: string, base?: string | URL): URL {
  if (base) {
    return new URL(path, base);
  }
  try {
    return new URL(path);
  } catch {
    const origin =
      typeof window !== 'undefined' && window.location
        ? window.location.href
        : 'http://localhost';
    return new URL(path, origin);
  }
}

export default safeUrl;
