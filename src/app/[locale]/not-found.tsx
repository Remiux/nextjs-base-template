import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('not-found');

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-4 px-6 py-24">
      <title>{t('title')}</title>
      <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">{t('description')}</p>
      <Link className="w-fit font-medium underline underline-offset-4" href="/">
        {t('back-home')}
      </Link>
    </main>
  );
}
