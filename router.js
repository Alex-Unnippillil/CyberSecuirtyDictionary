(function (global) {
  const SUPPORTED_LOCALES = ['en', 'es'];
  function resolveLocale(pathname) {
    const path = pathname || (typeof window !== 'undefined' ? window.location.pathname : '');
    const segments = path.split('/').filter(Boolean);
    const locale = segments[0];
    return SUPPORTED_LOCALES.includes(locale) ? locale : 'en';
  }
  global.resolveLocale = resolveLocale;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = resolveLocale;
  }
})(typeof window !== 'undefined' ? window : {});
