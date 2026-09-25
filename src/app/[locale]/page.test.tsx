import { screen } from '@testing-library/react';
import { Suspense } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { siteConfig } from '@/config/site';
import type { Locale } from '@/i18n/locales';
import { renderWithIntl } from '@/test-utils/render-with-intl';

import Home from './page';

// `next-intl/server` only works in React Server Components.
vi.mock('next-intl/server', () => ({ setRequestLocale: vi.fn() }));

async function renderHome(locale: Locale = 'en') {
  await renderWithIntl(
    <Suspense>
      <Home params={Promise.resolve({ locale })} searchParams={Promise.resolve({})} />
    </Suspense>,
    { locale },
  );
}

describe('Home', () => {
  it('renders the project name as the main heading', async () => {
    await renderHome();

    expect(
      await screen.findByRole('heading', { level: 1, name: siteConfig.name }),
    ).toBeInTheDocument();
  });

  it('tells the developer which file to edit', async () => {
    await renderHome();

    expect(await screen.findByText('src/app/[locale]/page.tsx')).toBeInTheDocument();
  });

  it('renders a link to the documentation', async () => {
    await renderHome();

    expect(await screen.findByRole('link', { name: 'Documentation' })).toHaveAttribute(
      'href',
      expect.stringContaining('nextjs.org/docs'),
    );
  });

  it('renders the copy in the requested locale', async () => {
    await renderHome('es');

    expect(await screen.findByRole('link', { name: 'Documentación' })).toBeInTheDocument();
    expect(screen.getByText(/para empezar, edita/i)).toBeInTheDocument();
  });
});
