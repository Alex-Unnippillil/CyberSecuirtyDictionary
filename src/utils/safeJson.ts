export function safeParse<T>(raw: string | null, fallback: T, onError?: (error: unknown) => void): T {
  if (raw === null || raw === undefined) {
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    if (onError) {
      onError(error);
    } else {
      console.warn('Failed to parse JSON', error);
    }
    return fallback;
  }
}
