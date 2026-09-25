import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

// Locale negotiation, redirects to the localized URL and locale cookie updates.
export default createMiddleware(routing);

export const config = {
  // Every pathname except `/api`, `/trpc`, Next.js/Vercel internals and files with an
  // extension (e.g. `favicon.ico`, `robots.txt`, `sitemap.xml`).
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
