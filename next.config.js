/** @type {import('next').NextConfig} */
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "demo";

const legacyRedirects = [
  { source: "/term/:slug*", destination: "/:slug*", permanent: true },
  { source: "/terms/:slug*", destination: "/:slug*", permanent: true },
  { source: "/word/:slug*", destination: "/:slug*", permanent: false },
];

const nextConfig = {
  images: {
    loader: "cloudinary",
    path: `https://res.cloudinary.com/${cloudName}/image/upload/`,
  },
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
  async redirects() {
    return legacyRedirects;
  }
};

module.exports = nextConfig;
