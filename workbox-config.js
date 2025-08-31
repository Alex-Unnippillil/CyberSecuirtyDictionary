module.exports = {
  globDirectory: '.',
  globPatterns: [
    'index.html',
    'styles.css',
    'script.js',
    'assets/**/*.{css,js}',
  ],
  swDest: 'sw.js',
  runtimeCaching: [
    {
      urlPattern: ({request}) => ['image', 'font'].includes(request.destination),
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'images-fonts',
      },
    },
    {
      urlPattern: ({url}) => url.pathname.endsWith('.json'),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'json-data',
      },
    },
  ],
};
