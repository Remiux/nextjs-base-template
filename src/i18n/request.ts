import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { getMessages } from './messages';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // The proxy already negotiated the locale; here it is only validated and consumed.
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: await getMessages(locale),
  };
});
