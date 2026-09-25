import { defineRouting } from 'next-intl/routing';

import { defaultLocale, locales } from './locales';

/**
 * Central routing configuration for `next-intl`, consumed by the proxy (`src/proxy.ts`),
 * the navigation helpers and the request config. See `i18n-builder/README.md`.
 */
export const routing = defineRouting({
  locales: [...locales],
  // Fallback when neither the URL, the locale cookie nor the browser language match.
  defaultLocale,
  // Negotiate the locale from the cookie first and the `Accept-Language` header second.
  localeDetection: true,
  // All locales share the same pathnames. Omit `pathnames` rather than passing an empty map,
  // which would type every `href` of the navigation helpers as `never`.
});
