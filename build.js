const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

const filesToCopy = ['index.html', 'styles.css', 'script.js', 'data.json', 'service-worker.js'];
filesToCopy.forEach((file) => {
  const srcPath = path.join(__dirname, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(distDir, file));
  }
});

const offlineHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Offline</title>
</head>
<body>
  <h1>Offline</h1>
  <p>You are currently offline. Please reconnect to use the Cyber Security Dictionary.</p>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'offline.html'), offlineHtml);
console.log('Build complete');
