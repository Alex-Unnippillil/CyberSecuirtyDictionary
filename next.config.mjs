const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Referrer-Policy",
    value: "no-referrer",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Permissions-Policy",
    value: "geolocation=(), microphone=(), camera=()",
  },
];

const legacyRedirects = [
  { source: "/term/:slug*", destination: "/:slug*", permanent: true },
  { source: "/terms/:slug*", destination: "/:slug*", permanent: true },
  { source: "/word/:slug*", destination: "/:slug*", permanent: false },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return legacyRedirects;
  },
};

export default nextConfig;
