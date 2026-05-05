const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "demo";

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
      "base-uri 'none'",
    ].join("; ");

    const cspHeader =
      process.env.CSP_ENFORCE === "true"
        ? { key: "Content-Security-Policy", value: csp }
        : { key: "Content-Security-Policy-Report-Only", value: csp };

    return [
      {
        source: "/:path*",
        headers: [...securityHeaders, cspHeader],
      },
    ];
  },
};

export default nextConfig;
