import { env } from '@/env';

// Single place to rename the project: metadata, robots.txt and the sitemap read from here.
export const siteConfig = {
  name: 'Next.js Base Template',
  description: 'A Next.js starter with TypeScript, Tailwind CSS, testing and CI ready to go.',
  lang: 'en',
  url: env.NEXT_PUBLIC_APP_URL,
};
