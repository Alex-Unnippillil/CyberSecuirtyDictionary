const fs = require('fs');
const path = require('path');

const config = {
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || '',
  NEXT_PUBLIC_AI_MODELS: process.env.NEXT_PUBLIC_AI_MODELS || ''
};

const outputPath = path.join(__dirname, '..', 'assets', 'js', 'env-config.js');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `window.env = ${JSON.stringify(config)};`);
