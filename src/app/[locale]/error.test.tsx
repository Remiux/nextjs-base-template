import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderWithIntl } from '@/test-utils/render-with-intl';

import ErrorPage from './error';

describe('ErrorPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reports the error and retries when asked', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const retry = vi.fn();
    const error = new Error('boom');

    await renderWithIntl(<ErrorPage error={error} retry={retry} />, { locale: 'es' });

    expect(screen.getByRole('heading', { name: 'Algo salió mal' })).toBeInTheDocument();
    expect(consoleError).toHaveBeenCalledWith(error);

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(retry).toHaveBeenCalledOnce();
  });
});
