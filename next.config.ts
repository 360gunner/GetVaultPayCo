import type { NextConfig } from "next";
import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";
const withVanillaExtract = createVanillaExtractPlugin();

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://challenges.cloudflare.com https://static.cloudflareinsights.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob: https://api.qrserver.com",
      "font-src 'self' data: https://r2cdn.perplexity.ai",
      "connect-src 'self' https://vitals.vercel-insights.com https://challenges.cloudflare.com https://cloudflareinsights.com https://vaultpay.shop",
      "frame-src 'self' https://challenges.cloudflare.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ')
  }
];

const nextConfig: NextConfig = {
  // ✅ Build output directory
  distDir: "latest builds",

  // ✅ Build as deployable React app (not static HTML)

  // ✅ Ensure all routes have trailing slashes (important for cPanel HTML files)
  trailingSlash: true,

  // ✅ Ignore ESLint warnings during build
  eslint: { ignoreDuringBuilds: true },

  // ✅ Add security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },

  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,

  // ✅ Image optimization disabled for static hosting
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        pathname: '/v1/create-qr-code/**',
      },
    ],
  },
};

export default withVanillaExtract(nextConfig);
