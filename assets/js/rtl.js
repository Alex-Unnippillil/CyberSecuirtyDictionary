const rtlLocales = ["ar", "he", "fa", "ur", "ps", "sd", "ug"];

const userLang = (navigator.language || "").toLowerCase();
const isRTL = rtlLocales.some((locale) => userLang.startsWith(locale));

document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
