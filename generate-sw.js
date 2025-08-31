const workboxBuild = require('workbox-build');
const config = require('./workbox-config');

workboxBuild.generateSW(config).then(({count, size}) => {
  console.log(`Generated ${config.swDest}, which will precache ${count} files, totalling ${size} bytes.`);
});
