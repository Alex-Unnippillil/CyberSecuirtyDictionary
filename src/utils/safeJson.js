function safeParse(raw, fallback, onError) {
  if (raw === null || raw === undefined) {
    return fallback;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    if (typeof onError === 'function') {
      onError(error);
    } else {
      console.warn('Failed to parse JSON', error);
    }
    return fallback;
  }
}

module.exports = { safeParse };
