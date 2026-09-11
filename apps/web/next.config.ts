import type { NextConfig } from 'next';

// CSP for the app itself (brief §9). 'unsafe-inline' for scripts is the
// pragmatic MVP tradeoff for Next's inline bootstrap; tighten to nonces
// in the hardening phase.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@pflichtwaechter/rules', '@pflichtwaechter/db'],
  // Next's file tracing misses Prisma's generated client (with its native
  // query engine) inside the pnpm store; without this /readyz has no engine
  // in the standalone output.
  outputFileTracingIncludes: {
    '/**': ['../../node_modules/.pnpm/@prisma+client*/node_modules/.prisma/client/**'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
