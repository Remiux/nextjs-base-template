import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';

import { siteConfig } from '@/config/site';
import { resolveRouteLocale } from '@/i18n/route-locale';

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Shared by every page under `[locale]`; add an `opengraph-image.tsx` next to a page to override it.
export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = resolveRouteLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 32,
        padding: 96,
        background: '#0a0a0a',
        color: '#ededed',
      }}
    >
      <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: -2 }}>{siteConfig.name}</div>
      <div style={{ fontSize: 36, lineHeight: 1.4, color: '#a1a1aa' }}>{t('description')}</div>
    </div>,
    size,
  );
}
