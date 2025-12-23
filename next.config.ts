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
  { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=(), interest-cohort=(), payment=()' }
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
      {
        protocol: 'https',
        hostname: 'usinguse.online',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '98.83.36.86',
        pathname: '/**',
      },
    ],
  },
};

export default withVanillaExtract(nextConfig);
