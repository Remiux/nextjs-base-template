import type { MetadataRoute } from 'next';

import { absoluteUrl, getLocalizedPaths } from '@/i18n/seo';

// Add every public route here; each one is listed once per locale with its `hreflang` alternates.
const routes = ['/'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((href) => {
    const languages = Object.fromEntries(
      Object.entries(getLocalizedPaths(href)).map(([locale, path]) => [locale, absoluteUrl(path)]),
    );

    return Object.values(languages).map((url) => ({
      url,
      lastModified: new Date(),
      alternates: { languages },
    }));
  });
}
