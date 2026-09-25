import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import type { Locale } from './locales';
import { routing } from './routing';

/**
 * Validates the `[locale]` route segment (404 for unsupported locales) and enables static
 * rendering for it. Call it at the top of every layout, page and `generateMetadata` under
 * `app/[locale]`.
 */
export function resolveRouteLocale(locale: string): Locale {
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return locale;
}
