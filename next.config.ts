import type { NextConfig } from "next";

// Content Security Policy. next/font self-hosts the fonts so we don't need any
// google domains here. Scripts need unsafe-inline because Next injects its own
// inline bootstrap/hydration scripts and we're not wiring up nonces. Images are
// left open to https since the owner can paste in any cover/gallery url.
// Dev also needs unsafe-eval because React uses eval for debugging; prod never does.
const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = isDev ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" : "script-src 'self' 'unsafe-inline'";

const csp = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  // Client-direct blob uploads talk to vercel.com/api/blob and then the storage host.
  "connect-src 'self' https://vercel.com https://blob.vercel-storage.com https://*.public.blob.vercel-storage.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Descriptions can embed youtube videos, so allow its (cookieless) player iframe.
  "frame-src https://www.youtube-nocookie.com https://www.youtube.com",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Two years, preload-eligible. Only meaningful over https but harmless locally.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  agentRules: false,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
