import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithIntl } from '@/test-utils/render-with-intl';

import { LocaleSwitcher } from './locale-switcher';

vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  usePathname: () => '/en/about',
}));

describe('LocaleSwitcher', () => {
  it('links to the current page in every locale', async () => {
    await renderWithIntl(<LocaleSwitcher />);

    expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute('href', '/en/about');
    expect(screen.getByRole('link', { name: 'Español' })).toHaveAttribute('href', '/es/about');
  });

  it('marks the active locale', async () => {
    await renderWithIntl(<LocaleSwitcher />);

    expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'Español' })).not.toHaveAttribute('aria-current');
  });

  it('labels the navigation in the active locale', async () => {
    await renderWithIntl(<LocaleSwitcher />, { locale: 'es' });

    expect(screen.getByRole('navigation', { name: 'Idioma' })).toBeInTheDocument();
  });
});
