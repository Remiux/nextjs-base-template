import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';

// Add an entry per public route as the app grows.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
    },
  ];
}
