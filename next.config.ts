import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin({
  requestConfig: './src/i18n/request.ts',
  experimental: {
    // Generates `messages/en.d.json.ts` so message arguments are type-checked.
    createMessagesDeclaration: './messages/en.json',
  },
});

// Baseline headers that are safe for any app. For a Content-Security-Policy, see
// node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  typedRoutes: true,
  poweredByHeader: false,
  headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
