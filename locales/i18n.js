// @ts-check

/** @typedef {typeof import('./en.json')} LocaleStrings */
/** @typedef {keyof LocaleStrings} LocaleKey */

let messages = /** @type {LocaleStrings} */ ({})
let strictMode = false

/**
 * Load locale data.
 * @param {string} locale
 * @param {{strict?: boolean}} [options]
 */
export async function loadLocale(locale, options = {}) {
  strictMode = options.strict ?? false
  const res = await fetch(`locales/${locale}.json`)
  if (!res.ok) {
    throw new Error(`Failed to load locale: ${locale}`)
  }
  messages = await res.json()
}

/**
 * Get a localized string by key.
 * @param {LocaleKey} key
 * @returns {string}
 */
export function t(key) {
  const value = messages[key]
  if (value === undefined) {
    if (strictMode) {
      throw new Error(`Missing translation for key: ${key}`)
    }
    return key
  }
  return value
}
