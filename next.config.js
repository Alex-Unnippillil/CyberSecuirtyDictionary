const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "object-src 'none'",
      "base-uri 'none'"
    ].join('; ');

    const cspHeader = process.env.CSP_ENFORCE === 'true'
      ? { key: 'Content-Security-Policy', value: csp }
      : { key: 'Content-Security-Policy-Report-Only', value: csp };

    return [
      {
        source: '/(.*)',
        headers: [cspHeader]
      }
    ];
  },
  webpack(config) {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname),
      '@components': path.resolve(__dirname, 'components'),
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@lib': path.resolve(__dirname, 'lib'),
      '@styles': path.resolve(__dirname, 'styles'),
      '@src': path.resolve(__dirname, 'src'),
    };
    return config;
  }
};

module.exports = nextConfig;
