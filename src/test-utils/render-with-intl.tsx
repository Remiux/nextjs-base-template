import { act, render, type RenderOptions, type RenderResult } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactElement, ReactNode } from 'react';

import { defaultLocale, type Locale } from '@/i18n/locales';
import { getMessages } from '@/i18n/messages';

interface RenderWithIntlOptions extends Omit<RenderOptions, 'wrapper'> {
  locale?: Locale;
}

/**
 * Renders `ui` inside a `NextIntlClientProvider` loaded with the compiled messages of `locale`.
 * The render runs in an async `act` so components that suspend on `use(params)` settle before
 * the test queries the DOM.
 */
export async function renderWithIntl(
  ui: ReactElement,
  { locale = defaultLocale, ...options }: RenderWithIntlOptions = {},
): Promise<RenderResult> {
  const messages = await getMessages(locale);

  function IntlWrapper({ children }: { children: ReactNode }) {
    return (
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    );
  }

  let result: RenderResult | undefined;
  await act(async () => {
    result = render(ui, { wrapper: IntlWrapper, ...options });
  });
  return result!;
}
