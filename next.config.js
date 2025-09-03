/** @type {import('next').NextConfig} */
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "demo";

const nextConfig = {
  images: {
    loader: "cloudinary",
    path: `https://res.cloudinary.com/${cloudName}/image/upload/`,
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'nonce-__CSP_NONCE__'",
      "style-src 'self' 'unsafe-inline'",
      "object-src 'none'",
      "base-uri 'none'",
      "frame-ancestors 'none'",
    ].join('; ');

    const isProd = process.env.VERCEL_ENV === 'production';
    const cspHeader = {
      key: isProd ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only',
      value: csp,
    };

    return [
      {
        source: '/(.*)',
        headers: [cspHeader],
      },
    ];
  }
};

module.exports = nextConfig;
