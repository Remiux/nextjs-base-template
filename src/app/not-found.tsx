import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { routing } from '@/i18n/routing';

import './globals.css';

// Fallback for requests the proxy does not localize. Renders its own document because the root
// layout passes children through, and uses the default locale's messages.
export default async function RootNotFound() {
  const locale = routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: 'not-found' });

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 font-sans">
        <title>{t('title')}</title>
        <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">{t('description')}</p>
        <Link className="font-medium underline underline-offset-4" href={`/${locale}`}>
          {t('back-home')}
        </Link>
      </body>
    </html>
  );
}
