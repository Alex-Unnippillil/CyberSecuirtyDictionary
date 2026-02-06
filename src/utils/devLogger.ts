/**
 * Development-only wrapper for console.warn.
 * Provides a docs link and is silenced in production.
 */
export function devLogger(...args: unknown[]): void {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      'See docs: https://alex-unnippillil.github.io/CyberSecuirtyDictionary/docs/',
      ...args,
    );
  }
}
