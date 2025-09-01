const fs = require('fs');

const css = fs.readFileSync('assets/css/style.css', 'utf8');

function getVars(selectorPattern) {
  const regex = new RegExp(selectorPattern + '\\s*\\{([\\s\\S]*?)\\}', 'm');
  const match = css.match(regex);
  if (!match) {
    console.error(`Missing selector ${selectorPattern}`);
    process.exit(1);
  }
  const body = match[1];
  const vars = {};
  body.split(';').forEach((decl) => {
    const [name, value] = decl.split(':').map((s) => s && s.trim());
    if (name && value) {
      vars[name] = value;
    }
  });
  return vars;
}

const required = [
  '--color-bg',
  '--color-text',
  '--color-link',
  '--color-link-hover',
  '--color-card-bg',
  '--color-badge-bg',
  '--color-badge-text',
  '--color-skip-link-text',
];

function checkVariant(label, vars) {
  required.forEach((key) => {
    if (!(key in vars)) {
      console.error(`${label} missing ${key}`);
      process.exit(1);
    }
  });
  Object.keys(vars).forEach((key) => {
    if (!required.includes(key)) {
      console.error(`${label} has unsupported property ${key}`);
      process.exit(1);
    }
  });
}

const rootVars = getVars(':root');
const darkVars = getVars('\\[data-theme="dark"\\]');

checkVariant('default', rootVars);
checkVariant('dark', darkVars);

const lines = css.split(/\r?\n/);
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const match = line.match(/#([0-9a-fA-F]{3,6})/);
  if (match && !line.trim().startsWith('--')) {
    console.error(`Found hard-coded color value on line ${i + 1}`);
    process.exit(1);
  }
}

if (!css.includes('var(--')) {
  console.error('No token usage found');
  process.exit(1);
}

console.log('Token variant tests passed');
