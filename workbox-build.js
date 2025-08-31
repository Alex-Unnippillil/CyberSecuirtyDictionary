const { generateSW } = require('workbox-build');

async function buildSW() {
  try {
    const patterns = ['**/*.{html,css,js,png,jpg,jpeg,svg,gif,webp,json}'];
    if (require('fs').existsSync('pagefind')) {
      patterns.push('pagefind/**/*');
    }
    const { count, size, warnings } = await generateSW({
      globDirectory: '.',
      globPatterns: patterns,
      globIgnores: [
        'node_modules/**/*',
        'workbox-build.js',
        'package*.json',
        'sw.js'
      ],
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true
    });

    warnings.forEach(w => console.warn(w));
    console.log(`Generated sw.js, precaching ${count} files (${size} bytes).`);
  } catch (error) {
    console.error('Workbox build failed:', error);
    process.exit(1);
  }
}

buildSW();
