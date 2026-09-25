import type { Locale } from './locales';

// The English catalogue defines the shape every locale must follow.
export type Messages = (typeof import('../../messages/en.json'))['default'];

// `messages/<locale>.json` is compiled by `pnpm i18n:build` from `i18n-builder/messages/`.
export async function getMessages(locale: Locale): Promise<Messages> {
  const catalogue = (await import(`../../messages/${locale}.json`)) as { default: Messages };
  return catalogue.default;
}
