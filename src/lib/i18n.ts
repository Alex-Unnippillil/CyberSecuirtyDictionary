export type Locale = string;

interface TranslationMap {
  [key: string]: string;
}

const translations: Record<Locale, TranslationMap> = {
  en: {
    greeting: 'Hello',
  },
  // Other locales can be added here
};

/**
 * Translate a key for a given locale.
 * Falls back to English when the key is missing and logs a hint in development.
 * Never returns undefined; falls back to the key itself if no translation exists.
 */
export function t(key: string, locale: Locale = 'en'): string {
  const lang = translations[locale] || {};

  if (key in lang) {
    return lang[key];
  }

  const english = translations.en[key];
  if (english) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Missing translation for key "${key}" in locale "${locale}"`);
    }
    return english;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.warn(`Missing translation key "${key}" in all locales`);
  }

  return key;
}
