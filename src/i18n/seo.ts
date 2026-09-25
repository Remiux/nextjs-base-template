import type { Metadata } from 'next';

import { siteConfig } from '@/config/site';

import type { Locale } from './locales';
import { getPathname } from './navigation';
import { routing } from './routing';

type Href = Parameters<typeof getPathname>[0]['href'];

/** Localized pathname of `href` for every supported locale. */
export function getLocalizedPaths(href: Href): Record<Locale, string> {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, getPathname({ href, locale })]),
  ) as Record<Locale, string>;
}

/** `alternates` metadata for a page: its canonical URL plus one `hreflang` link per locale. */
export function getAlternates(href: Href, locale: Locale): Metadata['alternates'] {
  const paths = getLocalizedPaths(href);

  return {
    canonical: paths[locale],
    languages: { ...paths, 'x-default': paths[routing.defaultLocale] },
  };
}

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, siteConfig.url).toString();
}
