const wcag = require('wcag-contrast');

const themes = {
  light: { bg: '#f8f8f8', text: '#333333', minimum: 4.5 },
  dark: { bg: '#121212', text: '#ffffff', minimum: 4.5 },
  highContrast: { bg: '#000000', text: '#ffffff', minimum: 7 }
};

let ok = true;
for (const [name, cfg] of Object.entries(themes)) {
  const ratio = wcag.hex(cfg.bg, cfg.text);
  console.log(`${name} theme contrast ratio: ${ratio.toFixed(2)}`);
  if (ratio < cfg.minimum) {
    console.error(`${name} theme contrast ${ratio.toFixed(2)} is below required ${cfg.minimum}`);
    ok = false;
  }
}
if (!ok) process.exit(1);
