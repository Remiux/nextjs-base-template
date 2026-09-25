import { describe, expect, it } from 'vitest';

import sitemap from '@/app/sitemap';
import { siteConfig } from '@/config/site';

import { getAlternates } from './seo';

describe('getAlternates', () => {
  it('points the canonical URL at the current locale and lists every locale plus x-default', () => {
    expect(getAlternates('/', 'es')).toEqual({
      canonical: '/es',
      languages: { en: '/en', es: '/es', 'x-default': '/en' },
    });
  });
});

describe('sitemap', () => {
  it('lists each route once per locale with absolute hreflang alternates', () => {
    const languages = {
      en: new URL('/en', siteConfig.url).toString(),
      es: new URL('/es', siteConfig.url).toString(),
    };

    expect(sitemap()).toEqual([
      expect.objectContaining({ url: languages.en, alternates: { languages } }),
      expect.objectContaining({ url: languages.es, alternates: { languages } }),
    ]);
  });
});
