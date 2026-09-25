import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { use, type ReactNode } from 'react';

import { siteConfig } from '@/config/site';
import { resolveRouteLocale } from '@/i18n/route-locale';
import { getAlternates } from '@/i18n/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const locale = resolveRouteLocale((await params).locale);

  return {
    alternates: getAlternates('/', locale),
  };
}

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-black/6 px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/8">
      {children}
    </code>
  );
}

export default function Home({ params }: PageProps<'/[locale]'>) {
  resolveRouteLocale(use(params).locale);
  const t = useTranslations('home');

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">{siteConfig.name}</h1>
      <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        {t.rich('intro', { code: (chunks) => <Code>{chunks}</Code> })}
      </p>
      <a
        className="w-fit font-medium underline underline-offset-4"
        href="https://nextjs.org/docs"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('docs')}
      </a>
    </main>
  );
}
