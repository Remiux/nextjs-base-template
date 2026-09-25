import { env } from '@/env';

// Single place to rename the project: metadata, robots.txt and the sitemap read from here.
// Translatable copy (e.g. the description) lives in `i18n-builder/messages/`.
export const siteConfig = {
  name: 'Next.js Base Template',
  url: env.NEXT_PUBLIC_APP_URL,
};
